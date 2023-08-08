const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
// const auth = require('./middlewares/auth');

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
// авторизация
// app.use(auth);
// подключаем роуты
app.use(routes);
// запускаем сервер
app.listen(PORT);
