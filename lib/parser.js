const { InternalError } = require('./internal-error.js')
const { execAsync } = require('./exec-async.js')
const { getPublicIpv4 } = require('./public-ipv4.js')

let address = null

async function initAddress() {
  if (!address) {
    address = await getPublicIpv4()
  }
}
initAddress()

/**
 * 解析WireGuard配置信息
 * @returns {Promise<Array<import('../types/dumps').Interface>>}
 */
exports.parse = async function () {
  try {
    await initAddress()

    const command = 'wg show all dump'
    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      throw new InternalError(stderr)
    }
    const lines = stdout.trim().split('\n')

    let results = []

    for (let line of lines) {
      const fields = line.split('\t')
      // 接口信息行
      if (fields.length === 5) {
        const [interfaceName, privateKey, publicKey, listenPort, fwmark] = fields

        results.push({
          interfaceName,
          privateKey,
          publicKey,
          endpoint: `${address}:${listenPort}`,
          /** @type {'off'|number} */
          fwmark: fwmark === 'off' ? 'off' : Number(fwmark),
          peers: []
        })
      }
      // peer行
      if (fields.length === 9) {
        const [
          interfaceName,
          peerPublicKey,
          presharedKey,
          endpoint,
          allowedIps,
          latestHandshake,
          transferRx,
          transferTx,
          persistentKeepalive
        ] = fields

        results.find((item) => item.interfaceName === interfaceName).peers.push({
          peerPublicKey,
          presharedKey,
          endpoint,
          allowedIps,
          latestHandshake: Number(latestHandshake),
          transferRx: Number(transferRx),
          transferTx: Number(transferTx),
          /** @type {'off'|number}*/
          persistentKeepalive: (persistentKeepalive === 'off' ? 'off' : Number(persistentKeepalive))
        })
      }
    }

    return results

  } catch (err) {
    throw new InternalError(err.message)
  }
}