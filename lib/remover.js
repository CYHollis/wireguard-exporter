const { InternalError } = require('./internal-error.js')
const { execAsync } = require('./exec-async.js')

/**
 * 移除WireGuard对等点
 * @param {Object} opts
 * @param {string} opts.interfaceName - 接口名
 * @param {string} opts.peerPublicKey - 客户端公钥
 * @returns {Promise<void>}
 */
exports.remove = async function ({ interfaceName, peerPublicKey }) {
  const command = `wg set ${interfaceName} peer ${peerPublicKey} remove`
  try {
    const { stderr } = await execAsync(command)

    if (stderr) {
      throw new InternalError(stderr)
    }

  } catch (error) {
    throw new InternalError(error.message)
  }
}