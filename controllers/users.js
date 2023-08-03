const mongoose = require('mongoose');
const User = require('../models/user');

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

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

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Неверные данные' });
    });
};

// обновляем сведения о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
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
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(SUCCESS_CODE).send({ data: user }))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } if (error instanceof mongoose.Error.ValidationError) {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Не удалось обновить аватар' });
    });
};
