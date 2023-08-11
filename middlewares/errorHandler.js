const ERROR_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOT_FOUND_CODE = 404;
const CONFLICT_CODE = 409;
const SERVER_ERROR_CODE = 500;

module.exports.errorHandler = (err, req, res) => {
  const statusCode = err.status || SERVER_ERROR_CODE;
  const message = err.message || 'Произошла ошибка на сервере';

  if (err && err.status) {
    res.status(statusCode).send({ message });
  } else {
    res.status(SERVER_ERROR_CODE).send({ message });
  }
};

module.exports.BAD_REQUEST = {
  status: ERROR_CODE,
  message: 'Некорректные данные пользователя.',
};

module.exports.BAD_REQUEST_CARD = {
  status: ERROR_CODE,
  message: 'Некорректные данные карточки.',
};

module.exports.UNAUTHORIZED_RESPONSE = {
  status: UNAUTHORIZED_CODE,
  message: 'Необходима авторизация',
};

module.exports.ERROR_INVALID_USER_ID = {
  status: NOT_FOUND_CODE,
  message: 'Некорректный ID пользователя',
};

module.exports.ERROR_INVALID_CARD_ID = {
  status: NOT_FOUND_CODE,
  message: 'Некорректный ID карточки',
};
module.exports.ERROR_INVALID_PATH = {
  status: NOT_FOUND_CODE,
  message: 'Запрашиваемый ресурс не найден',
};

module.exports.ERROR_DUPLICATE_EMAIL = {
  status: CONFLICT_CODE,
  message: 'Пользователь с таким email уже существует',
};
