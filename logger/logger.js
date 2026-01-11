const dayjs = require('dayjs')

class logger {
  static info(message) {
    console.log(dayjs().format('YYYY-MM-DD HH:mm:ss,SSS'), 'INFO', message)
  }
}

exports.logger = logger