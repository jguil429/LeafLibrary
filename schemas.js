const Joi = require('joi');

module.exports.plantSchema = Joi.object({
    plant: Joi.object({
        common_name: Joi.string().required(),
        scientific_name: Joi.string().required(),
        image: Joi.string().required(),
        duration: Joi.string().required(),
        date_planted: Joi.string().required(),
    }).required()
});

module.exports.updateSchema = Joi.object({
    update: Joi.object({
        health: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});