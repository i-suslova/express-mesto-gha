const User = require("../models/user");

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

// получаем всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: "На сервере произошла ошибка" }));
};

// получаем пользователя по id
module.exports.getUserById = (req, res) => {
  const UserId = req.params.userId;

  User.findById(UserId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: user });
    })
    .catch((error) => {
      console.error(error.message);
      res.status(SERVER_ERROR_CODE).send({ message: "Произошла ошибка при получении пользователя" });
    });
};

// создаем нового пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(ERROR_CODE).send({ message: "Неверные данные" });
      } else {
        console.error(error);
        res.status(SERVER_ERROR_CODE).send({ message: "Не удалось создать пользователя" });
      }
    });
};

// обновляем сведения о пользователе
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND_CODE).send({ message: "Пользователь не найден" });
      }
      return res.status(200).send({ data: updatedUser });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Неверные данные" });
      }
      console.error(error);
      return res.status(SERVER_ERROR_CODE).send({ message: "Произошла ошибка при обновлении профиля" });
    });
};

// обновляем аватар пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(ERROR_CODE).send({ message: "Отсутствуют данные об аватаре" });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Пользователь не найден" });
      }
      return res.status(201).send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: "Не удалось обновить аватар" }));
};
