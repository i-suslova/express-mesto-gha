const Card = require("../models/card");

const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res
      .status(SERVER_ERROR_CODE)
      .send({ message: "Ошибка при получении списка карточек" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE).send({ message: "Неверные данные" });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: "Ошибка при создании карточки" });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Карточка с указанным идентификатором не найдена" });
      }
      return res.status(200).send({ message: "Карточка успешно удалена" });
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка" });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Карточка с указанным идентификатором не найдена" });
      }
      return res.status(200).send(card);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Ошибка при обновлении карточки" });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "Карточка с указанным идентификатором не найдена" });
      }
      return res.status(200).send(card);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: "Ошибка при обновлении карточки" });
    });
};
