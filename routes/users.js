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
const {
  loginValidator,
  signupValidator,
  updateUserValidator,
  avatarValidator,
  userByIdValidator,
} = require('../validators/userValidator');

// роут для регистрации пользователя
router.post('/signup', signupValidator, createUser);

// роут для аутентификации
router.post('/signin', loginValidator, login);

// роут для получения всех пользователей
router.get('/', authUser, getUsers);

// роут для получения информации о текущем пользователе
router.get('/me', authUser, getUserInfo);

// роут для получения пользователя по _id
router.get('/:userId', authUser, userByIdValidator, getUserById);

// роут для обновления профиля
router.patch('/me', authUser, updateUserValidator, updateUser);

// роут для обновления аватара
router.patch('/me/avatar', authUser, avatarValidator, updateAvatar);

module.exports = router;
