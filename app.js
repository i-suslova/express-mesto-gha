const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();

// для собирания JSON-формата
app.use(express.json());
// для обработки данных, отправленных через формы HTML
app.use(express.urlencoded({ extended: true }));
// подключаем роуты
app.use(routes);
// централизованная обработка ошибок
app.use(errorHandler);
// обработчики ошибок 'celebrate'
app.use(errors());
// запускаем сервер
app.listen(PORT);
