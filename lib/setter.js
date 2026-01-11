const { InternalError } = require('./internal-error.js')
const { execAsync } = require('./exec-async.js')

/**
 * 添加WireGuard对等点
 * @param {Object} opts
 * @param {string} opts.interfaceName - 接口名
 * @param {string} opts.peerPublicKey - 客户端公钥
 * @param {string} opts.allowedIps - 客户端分配IP
 * @returns {Promise<void>}
 */
exports.set = async function ({ interfaceName, peerPublicKey, allowedIps }) {
  const command = `wg set ${interfaceName} peer ${peerPublicKey} allowed-ips ${allowedIps}`
  try {
    const { stderr } = await execAsync(command)

    if (stderr) {
      throw new InternalError(stderr)
    }

  } catch (error) {
    throw new InternalError(error.message)
  }
}