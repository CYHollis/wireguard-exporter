#!/bin/sh
set -e

CONF_DIR="/etc/wireguard"

# 删除已有接口
for conf in "$CONF_DIR"/*.conf; do
  [ -e "$conf" ] || continue
  iface=$(basename "$conf" .conf)
  ip link delete "$iface" 2>/dev/null || true
done

# 启动 WireGuard 接口
for conf in "$CONF_DIR"/*.conf; do
  [ -e "$conf" ] || continue
  iface=$(basename "$conf" .conf)
  wg-quick up "$iface"
done

npm run start --silent

exec tail -f /dev/null