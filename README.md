# ClassWayX

欢迎来到 ClassWayX 代码仓库。

---

ClassWayX 是一个用来管理班级积分的系统，但是目前它的实际功能只有飞书消息推送。

# 核心功能

 - 添加班级，并配置班级 id 和多个飞书 webhook 机器人推送连接
 - 提供方便的 API，一键方便快捷地向一个班级的所有机器人推送消息

# 在开发模式下运行项目

## 前置条件 Prerequisites

- **Docker**: `29.x.x` 或更高
- **Docker Compose**: `2.24.4` 或更高（开发配置使用 `!override` 替换端口）
- **Node.js**: `24.x.x` 或更高
- **npm**: `11.x.x` 或更高

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/ClassWayX/classwayx.git
cd classwayx
```

### 2. 复制 Docker Compose Override 文件

```bash
cp docker-compose.override.yml.example docker-compose.override.yml
```

然后，如果有需要，可以自己修改开发环境下 `docker-compose.override.yml` 文件里的镜像名、容器名或端口映射设置等。

### 3. 配置环境变量

```bash
cp .env.example .env

cp lark-bot/.env.example lark-bot/.env
```

补全所有的环境变量。

### 4. 运行开发环境应用

```bash
docker compose up
```

运行成功后，可以前往 [http://localhost:3001/](http://localhost:3001/)（或自定义的端口）查看飞书机器人管理页面。

`app` 服务目前默认关闭，需要时同时取消两个 Compose 文件中对应服务的注释。

### 5. 日常开发

```
# 停止应用
docker compose stop

# 在后台启动应用
docker compose up -d

# 重新构建并启动应用
docker compose up --build

# package-lock.json 更新后，重建并更新开发容器的依赖卷
docker compose up --build --renew-anon-volumes

# 销毁运行的容器
docker compose down
```

## 开发与生产配置

`docker-compose.yml` 定义生产配置：应用使用 `runner` 镜像阶段，数据库迁移使用独立的 `migrator` 镜像阶段，源码和 Prisma 文件包含在各自镜像中。数据库初始化使用部署目录中的 `db_init.sql`。

本地 `docker compose up` 自动合并未纳入版本管理的 `docker-compose.override.yml`，将应用切换为 `dev` 阶段并挂载源码。开发端口通过 `!override` 替换为 `3001`；PostgreSQL 仅在开发环境发布到 `127.0.0.1:5432`。Prisma 客户端在开发容器启动时生成，修改 schema 后需重新生成或重启应用容器。

生产命令始终显式指定 `-f docker-compose.yml`，仅加载基础文件：

```bash
# 检查生产配置
docker compose -f docker-compose.yml config -q

# 在本地或 CI 中构建生产应用与迁移镜像
docker compose -f docker-compose.yml build lark-bot lark-bot-db-migration

# 启动生产配置，等待数据库、迁移以及应用就绪
docker compose -f docker-compose.yml up -d --no-build --wait --wait-timeout 120
```

应用健康检查访问 `/api/health`，实际连接数据库成功返回 `200`，连接失败返回 `503`。开发 override 关闭了定时健康检查。

两种配置沿用现有 Compose 项目名和 `classwayx-pgdata` 数据卷。在同一项目目录切换配置时会复用数据库数据和相关容器，不应同时运行两套配置。

### 接入 ACR 后的部署方式

目前基础文件保留 `build` 入口，现有 workflow 暂时仍在服务器构建。创建 ACR 仓库后，在根目录 `.env` 配置 `LARK_BOT_IMAGE` 和 `LARK_BOT_MIGRATION_IMAGE` 为同一次提交构建的完整镜像地址，建议固定 digest。`POSTGRES_IMAGE` 可指定同步到 ACR 的 PostgreSQL 镜像，并同时用于数据库和初始化服务。

服务器准备以下配置文件即可运行预构建镜像：

```text
docker-compose.yml
db_init.sql
.env
lark-bot/.env
```

后续 Actions 构建、推送镜像并传输部署配置后，服务器执行：

```bash
docker compose -f docker-compose.yml pull
docker compose -f docker-compose.yml up -d --no-build --wait --wait-timeout 120
```

迁移服务成功退出后应用才会启动。更新部署目录时需沿用原有 Compose 项目名，确保继续使用已有 PostgreSQL 数据卷。

## 数据库更改和迁移

### 1. 配置 DNS

请在本机上将 `postgres` 域名配置解析为 `127.0.0.1`。
例如，通过修改 `/etc/hosts` 实现，否则宿主机无法正常连接数据库。

```bash
sudo vim /etc/hosts # 在 macOS & Linux 上运行

# 随后写入新的一行：
# 127.0.0.1 postgres
```

### 2. 修改 schema.prisma

进入对应微服务的文件夹，修改其 `schema.prisma` 文件的内容。

### 3. 运行数据库迁移

确保数据库容器已启动（`docker compose up`）。
在终端进入对应微服务的文件夹，运行 `npx prisma migrate dev` 和 `npx prisma generate`。

# 仓库组织架构

[数据库初始化脚本](db_init.sql)（`db_init.sql`）。

[应用](/app)（`/app`）。网页应用本体，使用 Next.js 构建。

[飞书机器人消息推送](/lark-bot)（`/lark-bot`）。处理飞书自定义机器人消息推送的微服务。
