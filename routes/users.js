const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
} = require("../controllers/users");

// роут для получения всех пользователей
router.get("/", getUsers);

// роут для создания нового пользователя
router.post("/", createUser);

// роут для обновления профиля
router.patch("/me", updateUser);

// роут для обновления аватара
router.patch("/me/avatar", updateAvatar);

// роут для получения пользователя по _id
router.get("/:userId", getUserById);

module.exports = router;
