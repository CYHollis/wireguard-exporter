const { parse } = require('./parser.js')
const { set } = require('./setter.js')
const { remove } = require('./remover.js')
const { InvalidParameter } = require('./invalid-parameter-error.js')

/**
 * ShowAllDump路由
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
exports.useParserRoute = async function (request, reply) {
  const data = await parse()
  reply.status(200)
  return {
    status: 200,
    message: 'success',
    data
  }
}

/**
 * SetPeer路由
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
exports.useSetterRoute = async function (request, reply) {
  const { interfaceName, peerPublicKey, allowedIps } = request.query
  if (!interfaceName) {
    throw new InvalidParameter('Invalid parameter \\interfaceName\\')
  }
  if (!peerPublicKey) {
    throw new InvalidParameter('Invalid parameter \\peerPublicKey\\')
  }
  if (!allowedIps) {
    throw new InvalidParameter('Invalid parameter \\allowedIps\\')
  }
  await set({ interfaceName, peerPublicKey, allowedIps })
  reply.status(200)
  return {
    status: 200,
    message: 'success'
  }
}

/**
 * RemovePeer路由
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */
exports.useRemoverRoute = async function (request, reply) {
  const { interfaceName, peerPublicKey } = request.query
  if (!interfaceName) {
    throw new InvalidParameter('Invalid parameter \\interfaceName\\')
  }
  if (!peerPublicKey) {
    throw new InvalidParameter('Invalid parameter \\peerPublicKey\\')
  }
  await remove({ interfaceName, peerPublicKey })
  reply.status(200)
  return {
    status: 200,
    message: 'success'
  }
}