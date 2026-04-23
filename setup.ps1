@echo off
REM SunPanel Cloudflare 部署脚本 (Windows)

echo ☀️ SunPanel Cloudflare 部署脚本
echo =================================

where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 请先安装 Wrangler CLI: npm install -g wrangler
    pause
    exit /b 1
)

echo.
echo 📦 步骤 1: 创建 D1 数据库...
set /p DB_NAME="请输入数据库名称 [sunpanel-db]: "
if "%DB_NAME%"=="" set DB_NAME=sunpanel-db

echo 创建数据库...
call wrangler d1 create %DB_NAME%

echo.
echo 🔑 步骤 2: 创建 KV Namespace...
set /p KV_NAME="请输入 KV 名称 [SUNPANEL_KV]: "
if "%KV_NAME%"=="" set KV_NAME=SUNPANEL_KV

echo 创建 KV Namespace...
call wrangler kv:namespace create "%KV_NAME%"

echo.
echo 📝 步骤 3: 更新配置文件...
echo 请将上面的输出中的 database_id 和 id 填入 wrangler.toml 文件

echo.
echo 🔄 步骤 4: 执行数据库迁移...
call wrangler d1 migrations apply %DB_NAME% --file=./migrations/0001_initial.sql

echo.
echo ✅ 部署准备完成！
echo.
echo 下一步：
echo 1. 编辑 wrangler.toml 填入 database_id 和 KV id
echo 2. 运行 npm run build 构建前端
echo 3. 运行 wrangler deploy 部署到 Cloudflare
pause
