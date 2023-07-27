const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require("../controllers/cards");

// Роут для возврата всех карточек
router.get("/cards", getAllCards);

// Роут для создания карточек
router.post("/cards", createCard);

// Роут для удаления карточки по идентификатору
router.delete("/cards/:cardId", deleteCard);

// Роут для постановки лайка карточке
router.put("/cards/:cardId/likes", likeCard);

// Роут для удаления лайка с карточки
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
