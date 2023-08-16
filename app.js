const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// eslint-disable-next-line no-unused-vars
const { celebrate, Joi } = require('celebrate');
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
// обработчики ошибок 'celebrate'
app.use(errors());
// централизованная обработка ошибок
app.use(errorHandler);

// запускаем сервер
app.listen(PORT);
