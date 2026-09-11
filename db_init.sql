-- 创建飞书自定义机器人数据库
SELECT FORMAT('CREATE DATABASE %I', :'lark_bot_db')
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = :'lark_bot_db'
)\gexec

-- 创建专用角色
SELECT FORMAT('CREATE ROLE %I LOGIN PASSWORD %L', :'lark_bot_user', :'lark_bot_user_password')
WHERE NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = :'lark_bot_user'
)\gexec

-- 授权连接
GRANT CONNECT ON DATABASE :"lark_bot_db" TO :"lark_bot_user";

-- 切换数据库
\c :"lark_bot_db"

-- 创建 schema
CREATE SCHEMA IF NOT EXISTS "app";
ALTER SCHEMA "app" OWNER TO :"lark_bot_user";
