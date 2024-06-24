const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML.'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.plantSchema = Joi.object({
    plant: Joi.object({
        common_name: Joi.string().required().escapeHTML(),
        scientific_name: Joi.string().required().escapeHTML(),
        // images: Joi.array().required(),
        duration: Joi.string().required(),
        date_planted: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.updateSchema = Joi.object({
    update: Joi.object({
        health: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});