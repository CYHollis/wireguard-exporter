'use strict'

const fastify = require('fastify')
const { InvalidParameter } = require('./lib/invalid-parameter-error.js')
const { logger } = require('./logger/logger.js')
const { useParserRoute, useSetterRoute, useRemoverRoute } = require('./lib/route.js')

const startTime = new Date()
logger.info('Wireguard Exporter server is starting...\n')

async function bootstrap() {
  const app = fastify()
  process.on('SIGTERM', () => {
    app.close(() => {
      logger.info(`Wireguard Exporter server stopped, total uptime: ${stopTime - startTime}\n`)
      process.exit(0)
    })
  })

  process.on('exit', () => {
    app.close(() => {
      const stopTime = new Date()
      logger.info(`Wireguard Exporter server stopped, total uptime: ${stopTime - startTime}\n`)
    })
  })

  // 错误处理
  app.setErrorHandler((error, request, reply) => {
    reply.status(error.status || 500)
    reply.send({
      status: error.status || 500,
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
    })
  })

  app.get('/', async (request, reply) => {
    switch (request.query.action) {
      case 'ShowAllDump': {
        return useParserRoute(request, reply)
      }
      case 'SetPeer': {
        return useSetterRoute(request, reply)
      }
      case 'RemovePeer': {
        return useRemoverRoute(request, reply)
      }
      default:
        return new InvalidParameter('Invalid parameter \\action\\')
    }
  })

  // fastify服务器一定要手动指定ip
  app.listen({ port: 3174, host: '0.0.0.0' }, () => {
    const endTime = new Date()
    logger.info(`WireGuard Exporter server started successfully in ${endTime - startTime}ms\n`)
    logger.info(`Http address: http://0.0.0.0:3174\n`)
  })
}
bootstrap()
