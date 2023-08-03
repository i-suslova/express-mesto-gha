const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роут для возврата всех карточек
router.get('/', getAllCards);

// Роут для создания карточек
router.post('/', createCard);

// Роут для удаления карточки по идентификатору
router.delete('/:cardId', deleteCard);

// Роут для постановки лайка карточке
router.put('/:cardId/likes', likeCard);

// Роут для удаления лайка с карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
