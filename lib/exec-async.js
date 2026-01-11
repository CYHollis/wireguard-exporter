const { exec } = require('node:child_process')
const { promisify } = require('node:util')

exports.execAsync = promisify(exec)
