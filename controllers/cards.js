const mongoose = require('mongoose');
const Card = require('../models/card');

const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const {
  errorHandler,
  BAD_REQUEST_CARD,
  ERROR_INVALID_CARD_ID,
} = require('../middlewares/errorHandler');

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
      if (err.name === 'ValidationError') {
        errorHandler(BAD_REQUEST_CARD, req, res);
      } else {
        next(err);
      }
    });
};

// удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then(() => res.status(SUCCESS_CODE).send({ message: 'Карточка успешно удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(ERROR_INVALID_CARD_ID, req, res);
      } if (err instanceof mongoose.Error.CastError) {
        return errorHandler(BAD_REQUEST_CARD, req, res);
      }
      return next(err);
    });
};

// ставим лайк
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => res.status(SUCCESS_CODE).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(ERROR_INVALID_CARD_ID, req, res);
      } if (err instanceof mongoose.Error.CastError) {
        return errorHandler(BAD_REQUEST_CARD, req, res);
      }
      return next(err);
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
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return errorHandler(ERROR_INVALID_CARD_ID, req, res);
      } if (err instanceof mongoose.Error.CastError) {
        return errorHandler(BAD_REQUEST_CARD, req, res);
      }
      return next(err);
    });
};
