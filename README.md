# OVH抢购面板
感谢群友提供的源代码：https://github.com/coolci/OVH/

已构建好的镜像（支持arm/amd）：docker pull zmh2024/ovh:1.0

内存小于1G的VPS在未开swap的情况下不要运行
# 手动构建方法如下
### 1. 创建dockerflie
```
FROM node:20-bullseye

# 安装 Python 3.8+
RUN apt-get update && \
    apt-get install -y python3 python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 克隆仓库
RUN git clone https://github.com/coolci/OVH.git .

# 安装后端依赖
WORKDIR /app/backend
RUN pip3 install -r requirements.txt

# 安装前端依赖
WORKDIR /app
RUN npm install

# 创建改进的启动脚本
WORKDIR /app
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# 定义日志函数\n\
log() {\n\
    echo "[$(date "+%Y-%m-%d %H:%M:%S")] $1"\n\
}\n\
\n\
# 启动后端\n\
log "Starting backend..."\n\
cd /app/backend\n\
python3 app.py > /var/log/backend.log 2>&1 &\n\
BACKEND_PID=$!\n\
log "Backend started with PID: $BACKEND_PID"\n\
\n\
# 等待后端启动\n\
sleep 3\n\
\n\
# 启动前端\n\
log "Starting frontend..."\n\
cd /app\n\
npm run dev -- --host 0.0.0.0 > /var/log/frontend.log 2>&1 &\n\
FRONTEND_PID=$!\n\
log "Frontend started with PID: $FRONTEND_PID"\n\
\n\
# 监控进程\n\
log "Monitoring processes..."\n\
while true; do\n\
    if ! kill -0 $BACKEND_PID 2>/dev/null; then\n\
        log "Backend process died! Restarting..."\n\
        cd /app/backend\n\
        python3 app.py > /var/log/backend.log 2>&1 &\n\
        BACKEND_PID=$!\n\
        log "Backend restarted with PID: $BACKEND_PID"\n\
    fi\n\
    \n\
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then\n\
        log "Frontend process died! Restarting..."\n\
        cd /app\n\
        npm run dev -- --host 0.0.0.0 > /var/log/frontend.log 2>&1 &\n\
        FRONTEND_PID=$!\n\
        log "Frontend restarted with PID: $FRONTEND_PID"\n\
    fi\n\
    \n\
    sleep 10\n\
done' > /app/start.sh && chmod +x /app/start.sh

# 创建日志目录
RUN mkdir -p /var/log

# 暴露端口
EXPOSE 8080  5000

# 启动服务
CMD ["/bin/bash", "/app/start.sh"]
```
### 2. 构建镜像
```
docker build -t ovh .
```
### 3. 创建docker compose
```
services:
  ovh:
    image: ovh
    container_name: ovh
    ports:
      - "3000:8080"  # 前端端口
    volumes:
      # 映射配置文件到宿主机
      - ./config/constants.ts:/app/src/config/constants.ts
      - ./config/api_key_config.py:/app/backend/api_key_config.py
    restart: unless-stopped
    # 开发模式：保持 npm run dev 的热重载功能
    environment:
      - NODE_ENV=development
```
### 4. 启动容器
```
docker compose up -d
```
注意：需提前创建config文件夹，并将配置文件存放到config
















