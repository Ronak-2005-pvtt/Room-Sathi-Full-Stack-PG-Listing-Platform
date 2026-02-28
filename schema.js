const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image: Joi.any(),
        roomType: Joi.string()
            .valid("Single", "Double", "Triple","All are available")
            .required(),

        gender: Joi.string()
            .valid("Boys", "Girls", "Co-ed")
            .required(),

        MealPlan: Joi.string()
            .valid("Meals Included", "No Meals")
            .required(),

        wifi: Joi.string()
            .valid("Available", "Not Available")
            .required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required()
})