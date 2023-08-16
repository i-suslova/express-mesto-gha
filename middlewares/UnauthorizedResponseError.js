class UnauthorizedResponseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedResponseError';
    this.statusCode = 401;
  }
}

module.exports = {
  UnauthorizedResponseError,
};
