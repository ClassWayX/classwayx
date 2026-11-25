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

本地 `docker compose up` 自动合并未纳入版本管理的 `docker-compose.override.yml`，将应用切换为 `dev` 阶段并挂载源码。开发端口通过 `!override` 替换为 `3001`；PostgreSQL 仅在开发环境发布到 `127.0.0.1:5432`。Prisma 客户端在开发镜像构建时生成，开发 override 使用独立的匿名卷保存生成结果。修改 schema 后可执行 `docker compose exec lark-bot npx prisma generate` 重新生成。

生产命令始终显式指定 `-f docker-compose.yml`，仅加载基础文件：

```bash
# 检查生产配置
docker compose -f docker-compose.yml config -q

# 在本地或 CI 中构建生产应用与迁移镜像
docker compose -f docker-compose.yml build lark-bot lark-bot-db-migration

# 启动生产配置
docker compose -f docker-compose.yml up -d --no-build
```

两种配置沿用现有 Compose 项目名和 `classwayx-pgdata` 数据卷。在同一项目目录切换配置时会复用数据库数据和相关容器，不应同时运行两套配置。

### 通过 ACR 自动部署

`.github/workflows/deploy.yml` 在推送到 `main` 后自动部署。先使用 Node.js 24 安装依赖、生成测试所需的 Prisma Client，再执行 `npm test -- --run`，测试通过后才构建、推送镜像并部署。测试失败时会停止后续步骤。生产发布串行执行。

镜像由 GitHub Actions 构建为 `linux/amd64`，对应生产服务器的 `x86_64` 架构，并推送到阿里云北京 ACR 个人版：

| 配置项 | 值 |
| --- | --- |
| Registry | 从 Secret `ACR_REGISTRY` 读取 |
| 命名空间 | 从 Secret `ACR_NAMESPACE` 读取 |
| 应用仓库 | `classwayx.lark-bot`（Dockerfile 的 `runner` 阶段） |
| 迁移仓库 | `classwayx.lark-bot-migration`（Dockerfile 的 `migrator` 阶段） |

每次发布的两个镜像都以完整 commit SHA 作为标签；部署使用构建结果的 digest，避免同名标签变化影响本次发布。

#### GitHub Actions 配置

在仓库的 **Settings → Secrets and variables → Actions → Secrets** 中配置：

| Secret | 内容 |
| --- | --- |
| `ACR_REGISTRY` | ACR 实例的公网域名，不带 `https://` 或仓库路径 |
| `ACR_NAMESPACE` | 镜像仓库所在的命名空间 |
| `ACR_USERNAME` | ACR 访问凭证页面提供的 Registry 登录名 |
| `ACR_PASSWORD` | ACR 中设置的 Registry 固定密码 |
| `SERVER_IP` | 生产服务器地址，沿用现有配置 |
| `SERVER_USER` | SSH 登录用户，沿用现有配置 |
| `SERVER_SSH_SECRET_KEY` | SSH 私钥，沿用现有配置 |

Registry 和命名空间从 GitHub Secrets 读取，两个仓库名在 workflow 中配置。Actions 和服务器均使用上述 ACR 凭据登录镜像仓库。

#### 服务器目录和发布顺序

部署继续使用 `/home/<SERVER_USER>/classwayx` 目录，SSH 用户需能执行 Docker 并写入该目录。首次发布前，该目录需保留已有的 `.env` 和 `lark-bot/.env`，其中包含数据库和应用运行所需的配置。

Actions 只上传 `docker-compose.yml`、`db_init.sql` 和本次镜像地址文件 `release.env.next`。成功部署后的目录至少包含：

```text
docker-compose.yml
db_init.sql
.env
lark-bot/.env
release.env
```

服务器使用根目录 `.env` 和 `release.env.next` 两份环境变量文件，并显式指定基础 Compose 文件。拉取应用和迁移镜像后，统一执行一次 `docker compose up -d --no-build`；Compose 根据已有的 `depends_on` 等待 PostgreSQL 健康、初始化和 Prisma 迁移成功，再启动应用。服务器不再拉取源码或构建镜像。

Compose 启动流程报错时，脚本会停止部署。应用未配置健康检查，因此该步骤确认的是启动命令成功。

发布成功后，`release.env.next` 才会替换为 `release.env`，保存这次使用的 `LARK_BOT_IMAGE` 和 `LARK_BOT_MIGRATION_IMAGE`。例如，发布后查看服务状态：

```bash
docker compose --env-file .env --env-file release.env -f docker-compose.yml ps
```

两份 `--env-file` 都需要保留：`.env` 提供数据库配置，`release.env` 提供镜像地址。部署目录和 Compose 项目名沿用原值，以继续使用已有 PostgreSQL 数据卷。

PostgreSQL 继续使用基础文件指定的版本。发布时仅主动拉取两个 ACR 镜像；数据库镜像使用服务器本地已有版本，缺失时仍需从 Docker Hub 拉取。若将 PostgreSQL 同步到 ACR，可在服务器根目录 `.env` 设置 `POSTGRES_IMAGE`，数据库和初始化服务会同时使用该地址。

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

[应用](/app)（`/app`）。网页应用本体，使用 Next.js 构建。（注释状态）

[飞书机器人消息推送](/lark-bot)（`/lark-bot`）。处理飞书自定义机器人消息推送的微服务。

[用户验证](/auth)（`/auth`）。创建账户、登录账户等。