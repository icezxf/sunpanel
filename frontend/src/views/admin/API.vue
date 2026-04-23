<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">Open API</h3>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API Token</label>
          <div class="flex gap-2">
            <input
              :value="apiToken || '点击生成API Token'"
              type="text"
              readonly
              class="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-500"
            />
            <button @click="generateToken" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              {{ apiToken ? '重新生成' : '生成' }}
            </button>
          </div>
          <p class="mt-2 text-sm text-slate-500">请妥善保管您的 API Token，不要泄露给他人</p>
        </div>

        <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 class="font-medium text-slate-700 dark:text-slate-300 mb-4">API 使用示例</h4>
          <div class="space-y-4">
            <div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm">
              <p class="text-slate-500 mb-2">获取分组列表</p>
              <pre class="text-slate-700 dark:text-slate-300">GET /api/v1/groups
Authorization: Bearer YOUR_TOKEN</pre>
            </div>
            <div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm">
              <p class="text-slate-500 mb-2">获取网站列表</p>
              <pre class="text-slate-700 dark:text-slate-300">GET /api/v1/items
Authorization: Bearer YOUR_TOKEN</pre>
            </div>
            <div class="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm">
              <p class="text-slate-500 mb-2">创建分组</p>
              <pre class="text-slate-700 dark:text-slate-300">POST /api/v1/groups
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "我的分组",
  "icon": "ph:folder-bold"
}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const apiToken = ref(localStorage.getItem('apiToken') || '')

const generateToken = () => {
  if (!apiToken.value || confirm('重新生成将导致之前的 Token 失效，是否继续？')) {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    apiToken.value = token
    localStorage.setItem('apiToken', token)
  }
}
</script>
