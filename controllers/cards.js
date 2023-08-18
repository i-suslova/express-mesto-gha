const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/indexErrors');

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;

// получаем список карточек
module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch(next);
};

// создаем карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректные данные карточки.'));
      } else {
        next(err);
      }
    });
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        // проверяем, что текущий пользователь создал карточку
      } else if (!card.creator.equals(userId)) {
        next(new ForbiddenError('У вас нет прав на удаление этой карточки'));
      }
      return Card.findByIdAndDelete(req.params.cardId);
    })

    .then(() => res.status(SUCCESS_CODE).send({ message: 'Карточка успешно удалена' }))
    .catch(next);
};

// ставим лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Недопустимый формат данных.'));
      } else {
        next(err);
      }
    });
};

// удаляем лайк
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Недопустимый формат данных.'));
      } else {
        next(err);
      }
    });
};
