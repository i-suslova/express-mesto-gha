const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

const NOT_FOUND_CODE = 404;

router.use('/users', users);
router.use('/cards', cards);

// несуществующий путь
router.use('/*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
});
module.exports = router;
