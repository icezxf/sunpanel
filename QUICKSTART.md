# 快速开始

## 前置要求

- Node.js 18+
- npm 或 pnpm
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare 账号

## 部署步骤

### 1. 安装依赖

```bash
npm install
cd frontend && npm install
```

### 2. 配置 Cloudflare

```bash
# 登录 Cloudflare
wrangler login

# 创建 D1 数据库
wrangler d1 create sunpanel-db

# 创建 KV Namespace
wrangler kv:namespace create "SUNPANEL_KV"
```

将返回的 `database_id` 和 `id` 填入 `wrangler.toml` 文件。

### 3. 执行数据库迁移

```bash
wrangler d1 migrations apply sunpanel-db --file=./migrations/0001_initial.sql
```

### 4. 构建前端

```bash
npm run build
```

### 5. 部署

```bash
wrangler deploy
```

## 开发

```bash
# 前端开发
cd frontend && npm run dev

# Workers 开发
npm run dev:worker
```

## 默认账号

- 用户名: `admin`
- 密码: `admin123`

> ⚠️ 部署后请立即修改密码！

## 文档

更多文档请访问: https://sun-panel-doc.enianteam.com/zh_cn
