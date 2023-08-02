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
    _id: "64c8b7c0768785f09e4d48f6"
  };

  next();
});

// подключаем роуты
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

// несуществующий путь
app.use("/*", (req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

// запускаем сервер
app.listen(PORT, () => {
  console.log("Port запущен");
});
