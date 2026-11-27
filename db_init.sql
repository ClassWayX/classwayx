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
GRANT USAGE ON SCHEMA "app" to :"lark_bot_user";
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA "app" to :"lark_bot_user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "app" to :"lark_bot_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT SELECT, INSERT, UPDATE ON TABLES to :"lark_bot_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA "app" GRANT USAGE, SELECT ON SEQUENCES to :"lark_bot_user";

-- 认证服务使用独立的数据库和运行角色。
SELECT format('CREATE DATABASE %I', :'auth_db')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'auth_db')\gexec

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'auth_user', :'auth_user_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'auth_user')\gexec

REVOKE CONNECT, TEMPORARY ON DATABASE :"auth_db" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"auth_db" TO :"auth_user";
\c :"auth_db"

CREATE SCHEMA IF NOT EXISTS app;
GRANT USAGE ON SCHEMA app TO :"auth_user";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO :"auth_user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO :"auth_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"auth_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT USAGE, SELECT ON SEQUENCES TO :"auth_user";
