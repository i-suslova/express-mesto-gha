const router = require('express').Router();
const { authUser } = require('../middlewares/auth');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Роут для возврата всех карточек
router.get('/', authUser, getAllCards);

// Роут для создания карточек
router.post('/', authUser, createCard);

// Роут для удаления карточки по идентификатору
router.delete('/:cardId', authUser, deleteCard);

// Роут для постановки лайка карточке
router.put('/:cardId/likes', authUser, likeCard);

// Роут для удаления лайка с карточки
router.delete('/:cardId/likes', authUser, dislikeCard);

module.exports = router;
