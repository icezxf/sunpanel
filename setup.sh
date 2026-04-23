#!/bin/bash

# SunPanel Cloudflare 部署脚本

echo "☀️ SunPanel Cloudflare 部署脚本"
echo "================================"

# 检查依赖
if ! command -v wrangler &> /dev/null; then
    echo "❌ 请先安装 Wrangler CLI: npm install -g wrangler"
    exit 1
fi

# 1. 创建 D1 数据库
echo ""
echo "📦 步骤 1: 创建 D1 数据库..."
read -p "请输入数据库名称 [sunpanel-db]: " DB_NAME
DB_NAME=${DB_NAME:-sunpanel-db}

echo "创建数据库..."
wrangler d1 create $DB_NAME

# 2. 创建 KV Namespace
echo ""
echo "🔑 步骤 2: 创建 KV Namespace..."
read -p "请输入 KV 名称 [SUNPANEL_KV]: " KV_NAME
KV_NAME=${KV_NAME:-SUNPANEL_KV}

echo "创建 KV Namespace..."
wrangler kv:namespace create "$KV_NAME"

# 3. 更新 wrangler.toml
echo ""
echo "📝 步骤 3: 更新配置文件..."
echo "请将上面的输出中的 database_id 和 id 填入 wrangler.toml 文件"

# 4. 执行数据库迁移
echo ""
echo "🔄 步骤 4: 执行数据库迁移..."
wrangler d1 migrations apply $DB_NAME --file=./migrations/0001_initial.sql

echo ""
echo "✅ 部署准备完成！"
echo ""
echo "下一步："
echo "1. 编辑 wrangler.toml 填入 database_id 和 KV id"
echo "2. 运行 npm run build 构建前端"
echo "3. 运行 wrangler deploy 部署到 Cloudflare"
