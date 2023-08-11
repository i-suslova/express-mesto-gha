const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');

const {
  errorHandler,
  ERROR_INVALID_PATH,
} = require('../middlewares/errorHandler');

router.use('/users', users);
router.use('/cards', cards);

// несуществующий путь
router.use('/*', (req, res) => errorHandler(ERROR_INVALID_PATH, req, res));
module.exports = router;
