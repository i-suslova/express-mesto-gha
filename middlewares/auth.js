const jwt = require('jsonwebtoken');
const {
  errorHandler,
  UNAUTHORIZED_RESPONSE,
} = require('./errorHandler');

module.exports.authUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    errorHandler(UNAUTHORIZED_RESPONSE, req, res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    errorHandler(UNAUTHORIZED_RESPONSE, req, res);
  }

  req.user = payload;

  next();
};
