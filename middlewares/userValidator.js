const { celebrate, Joi } = require('celebrate');

module.exports.signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/i)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(/^(https?:\/\/)(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
});

module.exports.userByIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .alphanum()
      .length(24)
      .hex()
      .messages({
        'string.alphanum': 'ID должен содержать только буквенно-цифровые символы',
        'string.length': 'ID должен содержать ровно 24 символа',
        'string.hex': 'ID должен быть в шестнадцатеричном формате',
      }),
  }),
});
