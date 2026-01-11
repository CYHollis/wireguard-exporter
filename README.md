# WireGuard Exporter

## 安装

```bash
docker run -d --name wg \
  --network host \
  --cap-add=NET_ADMIN \
  -v /etc/wireguard:/etc/wireguard \
  wireguard-exporter
```

## 公共参数

**基地址** `http://localhost:3174`

**请求方法** `GET`

|   参数名   |                     类型                     |  必填  | 备注 |
| :--------: | :------------------------------------------: | :----: | :--: |
| **action** | `'ShowAllDump'` |`'SetPeer'` |`'RemovePeer'` | **是** | 操作 |

## API 参考

### ShowAllDump

获取对等点详细信息

**请求示例**

```bash
http GET http://localhost:3174?action=ShowAllDump
```

**返回示例**

```json
{
    "status": 200,
    "message": "success",
    "data": [
        {
            "interface": "wg0",
            "privateKey": "OJLjhW6f7DzSLZxKOGolwJTI6ZVpeedi888BIF35G1w=",
            "publicKey": "HK5Z7RHxkinSBMDYKYq25231ngu4dmgBo8j5vRDzRic=",
            "listenPort": "51820",
            "fwmark": "off",
            "peers": [{
                "peerPublicKey": "TzbHuqmaiAuLzw0c+c32om70UkaiGOrQ03Npo9pBjiM=",
                "presharedKey": "(none)",
                "endpoint": "(none)",
                "allowedIps": "10.0.0.2/32",
                "latestHandshake": 0,
                "transferRx": 0,
                "transferTx": 0,
                "persistentKeepalive": "off"
            }]
        }
    ]
}
```

### SetPeer

添加对等点

**参数**

|      参数名       |   类型   |  必填  |       备注       |
| :---------------: | :------: | :----: | :--------------: |
| **peerPublicKey** | `string` | **是** |    客户端公钥    |
|  **allowedIps**   | `string` | **是** | 分配给客户端的IP |
| **interfaceName** | `string` | **是** |     接口名称     |

**请求示例**

```bash
http GET http://localhost:3174?action=SetPeer&interfaceName=wg0&peerPublicKey=8G79ppbSjfIJxHjP10gOvZ0ecVoNGBcQOw3D42f0Kmk=&allowedIps=10.0.0.3/32
```

**响应示例**

```json
{
    "status": 200,
    "message": "success"
}
```

### RemovePeer

移除对等点

**参数**

|      参数名       |   类型   |  必填  |    备注    |
| :---------------: | :------: | :----: | :--------: |
| **peerPublicKey** | `string` | **是** | 客户端公钥 |
| **interfaceName** | `string` | **是** |  接口名称  |

**请求示例**

```bash
http GET http://localhost:3174?action=RemovePeer&interfaceName=wg0&peerPublicKey=8G79ppbSjfIJxHjP10gOvZ0ecVoNGBcQOw3D42f0Kmk=
```

**响应示例**

```bash
{
    "status": 200,
    "message": "success"
}
```

