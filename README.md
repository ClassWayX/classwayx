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

cd lark-bot
cp .env.example .env
```

补全所有的环境变量。

### 4. 运行开发环境应用

```bash
docker compose up
```

运行成功后，可以前往 [http://localhost:3000/](http://localhost:3000/)（或自定义的端口）查看应用。

### 5. 日常开发

```
# 停止应用
docker compose stop

# 在后台启动应用
docker compose up -d

# 重新构建并启动应用
docker compose up --buiild

# 销毁运行的容器
docker compose down
```

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