const { celebrate, Joi } = require('celebrate');

module.exports.createCarddValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required()
      .pattern(/^(https?:\/\/)(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
});

module.exports.deleteCardValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.likeDislikeValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});
