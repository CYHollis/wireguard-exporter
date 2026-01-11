# WireGuard本地配置

## 1. 安装

```bash
dnf install wireguard-tools -y
```

## 2. 配置服务端

```bash
cat <<EOF > /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = OJLjhW6f7DzSLZxKOGolwJTI6ZVpeedi888BIF35G1w=

[Peer]
PublicKey = TzbHuqmaiAuLzw0c+c32om70UkaiGOrQ03Npo9pBjiM=
AllowedIPs = 10.0.0.2/32
EOF
```

## 3. IP转发

```bash
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
```

## 4. NAT转发(重要)

```bash
iptables -t nat -A POSTROUTING -o wg0 -j MASQUERADE
iptables -A FORWARD -i wg0 -j ACCEPT
iptables -A FORWARD -o wg0 -j ACCEPT
```

## 5. 防火墙

```bash
sudo firewall-cmd --permanent --add-port=51820/udp
sudo firewall-cmd --permanent --add-masquerade
sudo firewall-cmd --reload
```

## 6. 启动

```bash
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
sudo wg show
```

