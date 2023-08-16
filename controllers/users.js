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

// const BadRequestError = require('../middlewares/ss');
// const ConflictError = require('../middlewares/email');

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
    .then((user) => {
      const { _id, ...userData } = user.toObject();
      res.status(CREATED_CODE).send({
        ...userData,
        password: undefined,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        errorHandler(ERROR_DUPLICATE_EMAIL, req, res);
      }
      if (err instanceof mongoose.Error.ValidationError) {
        errorHandler(BAD_REQUEST, req, res);
      }
      next(err);
    });
};
// module.exports.createUser = (req, res, next) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;

//   bcrypt.hash(password, 10)

//     .then((hash) => User.create({
//       name, about, avatar, email, password: hash,
//     }))
//     .then((user) => res.status(CREATED_CODE).send({
//       ...user.toObject(),
//       // удаляем пароль из данных перед отправкой
//       password: undefined,
//     }))

//     .catch((err) => {
//       if (err.code === 11000) {
//         errorHandler(ERROR_DUPLICATE_EMAIL, req, res);
//       } else {
//         next(err);
//       }
//     });
// };
// // аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      res.status(SUCCESS_CODE).send({ token });
    })

    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        errorHandler(UNAUTHORIZED_RESPONSE, req, res);
      }
      next(err);
    });
};

// получаем информацию о пользователе
module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
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
      }
      return next(err);
    });
};

// обновляем сведения о пользователе
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => {
      res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        errorHandler(BAD_REQUEST, req, res);
      }

      next(err);
    });
};

// обновляем аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    errorHandler(BAD_REQUEST, req, res);
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        errorHandler(BAD_REQUEST, req, res);
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
