const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,

} = require('../controllers/users');

// роут для получения всех пользователей
router.get('/', getUsers);

// роут для получения пользователя по _id
router.get('/:userId', getUserById);

// роут для создания нового пользователя
router.post('/', createUser);

// роут для обновления профиля
router.patch('/me', updateUser);

// роут для обновления аватара
router.patch('/me/avatar', updateAvatar);

module.exports = router;
