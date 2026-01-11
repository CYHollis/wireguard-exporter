class InvalidParameter extends Error {
  code = 'INVALID_PARAMETER'
  status = 400
  constructor(message) {
    super(message)
  }
}

exports.InvalidParameter = InvalidParameter
