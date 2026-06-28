# ClassWayX 代码仓库

欢迎来到 ClassWayX 代码仓库。

# 在开发模式下运行项目

## 前置条件 Prerequisites

 - **Docker**: `29.x.x` or higher

## 快速开始

 1. 克隆仓库

 ```
 git clone https://github.com/ClassWayX/classwayx.git
 cd classwayx
 ```

 2. 复制 Docker Compose Override 文件

 ```
 cp docker-compose.override.yml.example docker-compose.override.yml
 ```

 然后，如果有需要，可以自己修改开发环境下 `docker-compose.override.yml` 文件里的镜像名、容器名或端口映射设置等。

 3. 配置环境变量

 ```
 cp .env.example .env
 ```

 打开 `.env`，按照提示补全环境变量。

 4. 运行开发环境应用

 ```
 docker compose up --build
 ```

 运行成功后，可以前往 [http://localhost:3000/](http://localhost:3000/)（或自定义的端口）查看应用。

 5. 日常开发

 ```
 # 停止应用
 docker compose stop

 # 停止后再次启动
 docker compose start

 # 重启应用
 docker compose resart
 ```

# 仓库组织架构

[应用](/app)（`/app`）。网页应用本体，使用 Next.js 构建。