const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB запущен");
  })
  .catch((error) => {
    console.error("ошибка в подключения MongoDB", error);
  });

const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "64c7583ecdff7c9cf3dc78d6"
  };

  next();
});

// подключаем роуты
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

// // несуществующий роут
// const NOT_FOUND_CODE = 404;
// app.use("/", (req, res) => {
//   res.status(NOT_FOUND_CODE).send({
//     message: "Страница не найдена"
//   });
// });

// запускаем сервер
app.listen(PORT, () => {
  console.log("Port запущен");
});
