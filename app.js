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
// app.use((req, res, next) => {
//   // Получаем _id из параметров запроса
//   const { userId } = req.params;

//   req.user = {
//     _id: userId
//   };

//   next();
// });


// подключаем роуты
app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

// запускаем сервер
app.listen(PORT, () => {
  console.log("Port запущен");
});
