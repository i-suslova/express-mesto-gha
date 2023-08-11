const jwt = require('jsonwebtoken');
const {
  errorHandler,
  UNAUTHORIZED_RESPONSE,
} = require('./errorHandler');

module.exports.SECRET_KEY = 'some-secret-key';

module.exports.authUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return errorHandler(UNAUTHORIZED_RESPONSE, req, res);
  }

  const token = authorization.replace('Bearer ', '');

  return jwt.verify(token, 'some-secret-key', (err, payload) => {
    if (err) {
      return errorHandler(UNAUTHORIZED_RESPONSE, req, res);
    }

    req.user = payload;
    return next();
  });
};
