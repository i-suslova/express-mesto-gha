const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

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

app.use((req, res, next) => {
  req.user = {
    _id: '64c8b7c0768785f09e4d48f6',
  };
  next();
});

// подключаем роуты
app.use(routes);
// запускаем сервер
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Port запущен');
});
