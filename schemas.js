const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground:Joi.object({
    title: Joi.string().required(),
    location : Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),    
    // image: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1),
        body: Joi.string().required()
    }).required()
})

module.exports = {campgroundSchema, reviewSchema}