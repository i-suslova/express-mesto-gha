const router = require("express").Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar
} = require("../controllers/users");

// роут для получения всех пользователей
router.get("/users", getUsers);

// роут для получения пользователя по _id
router.get("/users/:userId", getUserById);

// роут для создания нового пользователя
router.post("/users", createUser);

// роут для обновления профиля
router.patch("/users/me", updateUser);

// роут для обновления аватара
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
