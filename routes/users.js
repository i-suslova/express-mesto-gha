const router = require("express").Router();
const {
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  getUserById
} = require("../controllers/users");

// роут для получения всех пользователей
router.get("/users", getUsers);

// роут для создания нового пользователя
router.post("/users", createUser);

// роут для обновления профиля
router.patch("/users/me", updateUser);

// роут для обновления аватара
router.patch("/users/me/avatar", updateAvatar);

// роут для получения пользователя по _id
router.get("/users/:userId", getUserById);

module.exports = router;
