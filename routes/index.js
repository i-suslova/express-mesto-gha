const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

const { NotFoundError } = require('../errors/indexErrors');

router.use('/users', users);
router.use('/cards', cards);

// несуществующий путь
// router.use('/*', (req, res, next) => {
//   next(new NotFoundError('Страница не найдена'));
// });
router.use('*', (req, res, next) => {
  const err = new NotFoundError('По указанному пути ничего не найдено');
  next(err);
  // next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;
