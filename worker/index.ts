/**
 * SunPanel Cloudflare Workers API
 * 专为免费 Worker Preview 环境优化 - 使用纯 KV 存储
 */

export interface Env {
  SUNPANEL_KV: KVNamespace
  ADMIN_PASSWORD?: string
}

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify({
    code: 0,
    message: 'success',
    data
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  })
}

const errorResponse = (message: string, status = 400) => {
  return new Response(JSON.stringify({
    code: status,
    message,
    data: null
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  })
}

// 简单的 token 验证
const verifyToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}

// 生成简单的 token
const generateToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

// 密码哈希
const hashPassword = (password: string): string => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash
}

// 获取管理员密码
const getAdminPassword = (env: Env): string => {
  return env.ADMIN_PASSWORD || 'admin123'
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    const path = url.pathname.replace('/api', '') || '/'
    const method = request.method

    // 处理 OPTIONS 请求
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      // ========== 认证相关 ==========
      
      // 登录
      if (path === '/auth/login' && method === 'POST') {
        const { username, password } = await request.json()
        
        // 默认管理员登录
        if (username === 'admin' && password === getAdminPassword(env)) {
          const token = generateToken()
          // 存储 token 到 KV，有效期 7 天
          const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
          await env.SUNPANEL_KV.put(`token:${token}`, JSON.stringify({
            username,
            role: 'admin',
            expiresAt
          }), { expirationTtl: 7 * 24 * 60 * 60 })
          
          return jsonResponse({
            token,
            user: {
              id: '1',
              username: 'admin',
              nickname: '管理员',
              role: 'admin'
            }
          })
        }
        
        return errorResponse('用户名或密码错误', 401)
      }

      // 登出
      if (path === '/auth/logout' && method === 'POST') {
        const token = verifyToken(request)
        if (token) {
          await env.SUNPANEL_KV.delete(`token:${token}`)
        }
        return jsonResponse({ success: true })
      }

      // 获取当前用户
      if (path === '/auth/me' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const tokenData = await env.SUNPANEL_KV.get(`token:${token}`, 'json')
        if (!tokenData) return errorResponse('Token 无效', 401)
        
        return jsonResponse({
          id: '1',
          username: 'admin',
          nickname: '管理员',
          role: 'admin'
        })
      }

      // ========== 分组管理 ==========
      
      // 获取分组列表
      if (path === '/groups' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const groups = await env.SUNPANEL_KV.get('groups', 'json')
        return jsonResponse(groups || [])
      }

      // 创建分组
      if (path === '/groups' && method === 'POST') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const groups = await env.SUNPANEL_KV.get('groups', 'json') || []
        const newGroup = {
          id: Date.now().toString(),
          ...await request.json(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        groups.push(newGroup)
        await env.SUNPANEL_KV.put('groups', JSON.stringify(groups))
        
        return jsonResponse(newGroup, 201)
      }

      // 更新分组
      if (path.match(/^\/groups\/[^/]+$/) && method === 'PUT') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const id = path.split('/')[2]
        const groups = await env.SUNPANEL_KV.get('groups', 'json') || []
        const index = groups.findIndex((g: any) => g.id === id)
        
        if (index === -1) return errorResponse('分组不存在', 404)
        
        groups[index] = {
          ...groups[index],
          ...await request.json(),
          id,
          updatedAt: new Date().toISOString()
        }
        
        await env.SUNPANEL_KV.put('groups', JSON.stringify(groups))
        return jsonResponse(groups[index])
      }

      // 删除分组
      if (path.match(/^\/groups\/[^/]+$/) && method === 'DELETE') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const id = path.split('/')[2]
        let groups = await env.SUNPANEL_KV.get('groups', 'json') || []
        groups = groups.filter((g: any) => g.id !== id)
        
        // 同时删除该分组下的所有项目
        let items = await env.SUNPANEL_KV.get('items', 'json') || []
        items = items.filter((i: any) => i.groupId !== id)
        
        await env.SUNPANEL_KV.put('groups', JSON.stringify(groups))
        await env.SUNPANEL_KV.put('items', JSON.stringify(items))
        
        return jsonResponse({ success: true })
      }

      // ========== 项目管理 ==========
      
      // 获取项目列表
      if (path === '/items' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const url = new URL(request.url)
        const groupId = url.searchParams.get('groupId')
        
        let items = await env.SUNPANEL_KV.get('items', 'json') || []
        
        if (groupId) {
          items = items.filter((i: any) => i.groupId === groupId)
        }
        
        return jsonResponse(items)
      }

      // 创建项目
      if (path === '/items' && method === 'POST') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const items = await env.SUNPANEL_KV.get('items', 'json') || []
        const newItem = {
          id: Date.now().toString(),
          ...await request.json(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        items.push(newItem)
        await env.SUNPANEL_KV.put('items', JSON.stringify(items))
        
        return jsonResponse(newItem, 201)
      }

      // 更新项目
      if (path.match(/^\/items\/[^/]+$/) && method === 'PUT') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const id = path.split('/')[2]
        let items = await env.SUNPANEL_KV.get('items', 'json') || []
        const index = items.findIndex((i: any) => i.id === id)
        
        if (index === -1) return errorResponse('项目不存在', 404)
        
        items[index] = {
          ...items[index],
          ...await request.json(),
          id,
          updatedAt: new Date().toISOString()
        }
        
        await env.SUNPANEL_KV.put('items', JSON.stringify(items))
        return jsonResponse(items[index])
      }

      // 删除项目
      if (path.match(/^\/items\/[^/]+$/) && method === 'DELETE') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const id = path.split('/')[2]
        let items = await env.SUNPANEL_KV.get('items', 'json') || []
        items = items.filter((i: any) => i.id !== id)
        
        await env.SUNPANEL_KV.put('items', JSON.stringify(items))
        return jsonResponse({ success: true })
      }

      // ========== 设置 ==========
      
      // 获取设置
      if (path === '/settings' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const settings = await env.SUNPANEL_KV.get('settings', 'json')
        return jsonResponse(settings || {
          theme: 'light',
          language: 'zh-CN',
          wallpaper: '#1e293b',
          wallpaperType: 'color',
          showSearchBar: true,
          searchEngine: 'https://www.google.com/search?q=',
          itemsPerRow: 6,
          showGroupNames: true,
          customCSS: '',
          customJS: ''
        })
      }

      // 保存设置
      if (path === '/settings' && method === 'PUT') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const settings = await request.json()
        await env.SUNPANEL_KV.put('settings', JSON.stringify(settings))
        
        return jsonResponse(settings)
      }

      // ========== 导出/导入 ==========
      
      // 导出数据
      if (path === '/export' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const groups = await env.SUNPANEL_KV.get('groups', 'json') || []
        const items = await env.SUNPANEL_KV.get('items', 'json') || []
        const settings = await env.SUNPANEL_KV.get('settings', 'json')
        
        return jsonResponse({
          version: '1.0.0',
          exportTime: new Date().toISOString(),
          groups,
          items,
          settings
        })
      }

      // 导入数据
      if (path === '/import' && method === 'POST') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const data = await request.json()
        
        if (data.groups) {
          await env.SUNPANEL_KV.put('groups', JSON.stringify(data.groups))
        }
        if (data.items) {
          await env.SUNPANEL_KV.put('items', JSON.stringify(data.items))
        }
        if (data.settings) {
          await env.SUNPANEL_KV.put('settings', JSON.stringify(data.settings))
        }
        
        return jsonResponse({ success: true })
      }

      // ========== Docker (示例数据) ==========
      
      if (path === '/docker/containers' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        // Workers 无法直接访问 Docker API，返回示例数据
        return jsonResponse([])
      }

      // ========== 图库 (简化实现) ==========
      
      if (path === '/gallery/user' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const images = await env.SUNPANEL_KV.get('images', 'json') || []
        return jsonResponse(images)
      }

      if (path === '/gallery/public' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        // 返回一些默认图标
        return jsonResponse([
          { id: '1', url: 'https://i.imgur.com/example1.png', name: '图标1' },
          { id: '2', url: 'https://i.imgur.com/example2.png', name: '图标2' }
        ])
      }

      // ========== 用户资料 ==========
      
      if (path === '/users/profile' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        return jsonResponse({
          id: '1',
          username: 'admin',
          nickname: '管理员',
          role: 'admin'
        })
      }

      if (path === '/users/profile' && method === 'PUT') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        // 简化处理
        return jsonResponse({ success: true })
      }

      if (path === '/users/change-password' && method === 'POST') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        const { oldPassword, newPassword } = await request.json()
        
        if (!verifyPassword(oldPassword, hashPassword(getAdminPassword(env)))) {
          return errorResponse('原密码错误', 400)
        }
        
        // 在实际环境中，这里应该更新环境变量
        return jsonResponse({ success: true })
      }

      // ========== 公共图库 ==========
      
      if (path === '/public-gallery' && method === 'GET') {
        const token = verifyToken(request)
        if (!token) return errorResponse('未登录', 401)
        
        // 返回预设的公共图标
        return jsonResponse([
          { id: '1', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg', name: 'GitHub' },
          { id: '2', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg', name: 'Twitter' },
          { id: '3', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg', name: 'Docker' },
          { id: '4', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg', name: 'Google' },
          { id: '5', url: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cloudflare.svg', name: 'Cloudflare' }
        ])
      }

      // 404 处理
      return errorResponse('Not Found', 404)

    } catch (error: any) {
      return errorResponse(error.message || 'Internal Server Error', 500)
    }
  }
}
