const jwt = require('jsonwebtoken');

const Unauthorized = 401;

module.exports.authUser = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(Unauthorized)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  return jwt.verify(token, 'some-secret-key', (err, payload) => {
    if (err) {
      return res.status(Unauthorized).send({ message: 'Необходима авторизация' });
    }

    req.user = payload;
    return next();
  });
};
