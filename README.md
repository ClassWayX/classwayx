# ClassWayX 代码仓库

欢迎来到 ClassWayX 代码仓库。

# 在开发模式下运行项目

## 前置条件 Prerequisites

- **Docker**: `29.x.x` or higher

## 快速开始

### 1. 克隆仓库

```
git clone https://github.com/ClassWayX/classwayx.git
cd classwayx
```

### 2. 复制 Docker Compose Override 文件

```
cp docker-compose.override.yml.example docker-compose.override.yml
```

然后，如果有需要，可以自己修改开发环境下 `docker-compose.override.yml` 文件里的镜像名、容器名或端口映射设置等。

### 3. 配置环境变量

```
cp .env.example .env

cd lark-bot
cp .env.example .env
```

补全所有的环境变量。

### 4. 运行开发环境应用

```
docker compose up
```

运行成功后，可以前往 [http://localhost:3000/](http://localhost:3000/)（或自定义的端口）查看应用。

### 5. 日常开发

```
# 停止应用
docker compose stop

# 停止后再次启动
docker compose start

# 重启应用
docker compose restart
```

## 数据库更改和迁移

### 1. 配置 DNS

请在本机上将 `postgres` 域名配置解析为 `127.0.0.1`。
例如，通过修改 `/etc/hosts` 实现。

### 2. 修改 schema.prisma

进入对应微服务的文件夹，修改其 `schema.prisma` 文件的内容。

### 3. 运行数据库迁移

确保数据库已启动（`docker compose up`）。
在终端进入对应微服务的文件夹，运行 `npx prisma migrate dev`。

# 仓库组织架构

[数据库初始化脚本](db_init.sql)（`db_init.sql`）。

[应用](/app)（`/app`）。网页应用本体，使用 Next.js 构建。

[飞书机器人消息推送](/lark-bot)（`/lark-bot`）。处理飞书自定义机器人消息推送的微服务。