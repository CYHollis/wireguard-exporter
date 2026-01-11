FROM node:20-alpine

WORKDIR /app

# 安装基础设施
RUN apk add --no-cache \
  wireguard-tools \
  iproute2 \
  iptables \
  bash

# 安装生产依赖
COPY package.json /app/
RUN cd /app
RUN npm install --production

# 复制源码(源码直发)
COPY . /app

# 设置启动脚本
RUN chmod +x /app/startup.sh
ENTRYPOINT ["/app/startup.sh"]
