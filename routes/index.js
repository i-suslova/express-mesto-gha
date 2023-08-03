const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const NOT_FOUND_CODE = 404;

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

// несуществующий путь
router.use('/*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});
