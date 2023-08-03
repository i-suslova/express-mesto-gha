const Card = require('../models/card');

const SUCCESS_CODE = 200;
const ERROR_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

// получаем список карточек
module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch(() => res
      .status(SERVER_ERROR_CODE)
      .send({ message: 'Ошибка при получении списка карточек' }));
};

// добавляем карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id }, { runValidators: true })
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Неверные данные' });
      } else {
        res
          .status(SERVER_ERROR_CODE)
          .send({ message: 'Ошибка при создании карточки' });
      }
    });
};

// удаляем карточку
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным идентификатором не найдена' });
      }
      return res.status(SUCCESS_CODE).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка при получении данных' });
    });
};

// ставим лайк
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным идентификатором не найдена' });
      }
      return res.status(SUCCESS_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка при получении данных' });
    });
};

// удаляем лайк
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Карточка с указанным идентификатором не найдена' });
      }
      return res.status(SUCCESS_CODE).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(ERROR_CODE)
          .send({ message: 'Ошибка: Некорректные данные.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Произошла ошибка при получении данных' });
    });
};
