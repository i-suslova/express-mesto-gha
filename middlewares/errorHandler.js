const ERROR_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOT_FOUND_CODE = 404;
const CONFLICT_CODE = 409;
const SERVER_ERROR_CODE = 500;

module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status || SERVER_ERROR_CODE;
  const message = err.message || 'На сервере произошла ошибка.';

  // ошибка валидации celebrate
  if (err.joi) {
    res.status(statusCode).send({
      error: err.joi.details[0].message,
    });
  }

  res.status(statusCode).send({ message });
  next();
};

module.exports.BAD_REQUEST = {
  status: ERROR_CODE,
  message: 'Некорректные данные .',
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
  message: 'Некорректный ID 99999999пользователя',
};

module.exports.ERROR_INVALID_CARD_ID = {
  status: NOT_FOUND_CODE,
  message: 'Некорректный ID карточки',
};
module.exports.ERROR_INVALID_PATH = {
  status: NOT_FOUND_CODE,
  message: 'Запрашиваемый ресурс 11не найден',
};

module.exports.ERROR_DUPLICATE_EMAIL = {
  status: CONFLICT_CODE,
  message: 'Пользователь lfyesс таким email уже существует',
};
