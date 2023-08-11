const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  errorHandler,
  BAD_REQUEST,
  ERROR_INVALID_USER_ID,
  ERROR_DUPLICATE_EMAIL,
  UNAUTHORIZED_RESPONSE,
} = require('../middlewares/errorHandler');
const { SECRET_KEY } = require('../middlewares/auth');

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;

// создаем нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)

    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      ...user.toObject(),
      // удаляем пароль из данных перед отправкой
      password: undefined,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return errorHandler(ERROR_DUPLICATE_EMAIL, req, res);
      }
      return next(err);
    });
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return errorHandler(UNAUTHORIZED_RESPONSE, req, res);
      }

      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });

      return res.send({ _id: user._id, token });
    })
    .catch(next);
};

// получаем информацию о пользователе
module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return errorHandler(BAD_REQUEST, req, res);
      }

      return res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return errorHandler(ERROR_INVALID_USER_ID, req, res);
      }

      return next(err);
    });
};

// получаем пользователя по id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))

    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(ERROR_INVALID_USER_ID, req, res);
      } if (err instanceof mongoose.Error.CastError) {
        return errorHandler(BAD_REQUEST, req, res);
      }
      return next(err);
    });
};

// обновляем сведения о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(BAD_REQUEST, req, res);
      }
      return next(err);
    });
};

// обновляем аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    errorHandler(BAD_REQUEST, res);
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(BAD_REQUEST, res);
      }
      return next(err);
    });
};

// получаем всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send({ data: users }))
    .catch(next);
};
