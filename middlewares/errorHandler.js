// const SERVER_ERROR_CODE = 500;

// module.exports = (err, req, res, next) => {
//   const { statusCode = SERVER_ERROR_CODE, message } = err;
//   res.status(statusCode).send({
//   // res.status(err.statusCode).send({
//     message: statusCode === SERVER_ERROR_CODE ? 'На сервере произошла ошибка.' : message,
//   });
//   // return next();
//   next();
// };
const SERVER_ERROR_CODE = 500;

// module.exports = (err, req, res, next) => {
//   if (err.details) {
//     const errorMessage = err.details.body[0].message;
//     res.status(400).send({ message: errorMessage });
//   } else {
//     const { statusCode = SERVER_ERROR_CODE, message } = err;
//     res.status(statusCode).send({
//       message: statusCode === SERVER_ERROR_CODE ? 'На сервере произошла ошибка.' : message,
//     });
//   }
//   next();
// };
module.exports = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Central error handler:', err);

  if (err.details) {
    const errorMessage = err.details.body[0].message;
    // eslint-disable-next-line no-console
    console.log('ValidationError:', errorMessage);
    res.status(400).send({ message: errorMessage });
  } else if (err.isJoi) {
    // eslint-disable-next-line no-console
    console.log('JoiError:', err.message);
    res.status(400).send({ message: err.message });
  } else {
    const { statusCode = SERVER_ERROR_CODE, message } = err;
    // eslint-disable-next-line no-console
    console.log('OtherError:', message);
    res.status(statusCode).send({
      message: statusCode === SERVER_ERROR_CODE ? 'На сервере произошла ошибка.' : message,
    });
  }
  next();
};
