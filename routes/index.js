const router = require('express').Router();

const { NotFoundError } = require('../utils/errors/notFoundError');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authRouter = require('./auth');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
// используем модуль для аутентификации
router.use('/', authRouter);

// несуществующий путь
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
