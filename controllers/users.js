const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)

    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Неверные данные' });
    });
};

// аутентификация
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)

    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неверный email или пароль.' });
      }

      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 3600000 * 24 * 7,
      });

      return res.send({ _id: user._id, token });
    })
    .catch(() => {
      res.status(NOT_FOUND_CODE).send({ message: 'Неверные 11данные' });
    });
};

// получаем информацию о пользователе
module.exports.getUserInfo = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь не найден' });
      }

      return res.status(SUCCESS_CODE).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Некорректный ID пользователя' });
      }

      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка при получении данных пользователя' });
    });
};

// получаем пользователя по id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь не существует' });
      } if (error instanceof mongoose.Error.CastError) {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка при получении данных' });
    });
};

// обновляем сведения о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Не удалось обновить информацию' });
    });
};

// обновляем аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(ERROR_CODE).send({ message: 'Отсутствуют данные об аватаре' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Не удалось обновить аватар' });
    });
};

// получаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send({ data: users }))
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
