class InternalError extends Error {
  code = 'INTERNAL_ERROR'
  status = 500
  constructor(message) {
    super(message)
  }
}

exports.InternalError = InternalError
