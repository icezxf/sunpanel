-- SunPanel Cloudflare D1 数据库迁移脚本
-- 执行: wrangler d1 migrations apply sunpanel-db

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- 分组表
CREATE TABLE IF NOT EXISTS `groups` (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    user_id INTEGER NOT NULL,
    parent_id INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES `groups`(id) ON DELETE SET NULL
);

-- 项目表 (网站)
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    order_index INTEGER DEFAULT 0,
    open_in_new_tab INTEGER DEFAULT 1,
    show_as_window INTEGER DEFAULT 0,
    window_width INTEGER DEFAULT 800,
    window_height INTEGER DEFAULT 600,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 图片表
CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    user_id INTEGER,
    is_public INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_groups_user_id ON `groups`(user_id);
CREATE INDEX IF NOT EXISTS idx_items_group_id ON items(group_id);
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);

-- 插入默认管理员账号 (密码: admin123)
-- 实际部署时请修改密码
INSERT INTO users (username, password, nickname, role, created_at, updated_at) 
VALUES ('admin', 'YWRtaW4xMjNfaGFzaGVk', '管理员', 'admin', datetime('now'), datetime('now'));
