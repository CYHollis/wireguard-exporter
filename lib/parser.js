const { InternalError } = require('./internal-error.js')
const { execAsync } = require('./exec-async.js')

/**
 * 解析WireGuard配置信息
 * @returns {Promise<Array<import('../types/dumps').Interface>>}
 */
exports.parse = async function () {
  try {
    const command = 'wg show all dump'
    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      throw new InternalError(stderr)
    }
    const lines = stdout.trim().split('\n')

    // 删除第一行interface信息
    const dumps = lines.slice(1).map((line, index) => {
      const fields = line.split('\t')
      const [
        peerPublicKey,
        presharedKey,
        endpoint,
        allowedIps,
        latestHandshake,
        transferRx,
        transferTx,
        persistentKeepalive
      ] = fields
      return {
        peerPublicKey,
        presharedKey,
        endpoint,
        allowedIps,
        latestHandshake: Number(latestHandshake),
        transferRx: Number(transferRx),
        transferTx: Number(transferTx),
        persistentKeepalive: persistentKeepalive === 'off' ? -1 : Number(persistentKeepalive)
      }
    })

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
          listenPort: Number(listenPort),
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