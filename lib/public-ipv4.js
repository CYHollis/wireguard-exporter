const os = require('node:os')
const http = require('node:http')

function getLocalIpv4() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }
}

function getPublicIpv4() {
  return new Promise((resolve) => {
    // 先尝试访问阿里云元数据
    const req = http.get(
      'http://100.100.100.200/latest/meta-data/public-ipv4',
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          if (res.statusCode === 200) {
            // 1. 能获取到 => 阿里云环境，拿到公网IP
            resolve(data.trim())
          } else {
            // 2. 请求通了但没数据 => 降级拿局域网IP
            resolve(getLocalIpv4() || '')
          }
        })
      }
    )

    req.on('error', () => {
      // 3. 连接失败（如超时、拒绝）=> 虚拟或本地环境，拿局域网IP
      resolve(getLocalIpv4())
    })

    req.setTimeout(1000, () => req.destroy()) // 设置1秒超时
  })
}

exports.getLocalIpv4 = getLocalIpv4
exports.getPublicIpv4 = getPublicIpv4