const router = require('express').Router();
const { authUser } = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,

} = require('../controllers/users');

// роут для регистрации пользователя
router.post('/signup', createUser);

// роут для аутентификации
router.post('/signin', login);

// роут для получения всех пользователей
router.get('/', getUsers);

// роут для получения пользователя по _id
router.get('/:userId', getUserById);

// роут для получения информации о текущем пользователе
router.get('/me', authUser, getUserInfo);

// роут для обновления профиля
router.patch('/me', authUser, updateUser);

// роут для обновления аватара
router.patch('/me/avatar', authUser, updateAvatar);

module.exports = router;
