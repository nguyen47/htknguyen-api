const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  description: {
    type: String,
    minlength: 5
  }
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(categories) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(255)
      .required(),
    description: Joi.string()
      .min(5)
      .max(255)
  };

  return Joi.validate(categories, schema);
}

module.exports.Category = Category;
module.exports.validate = validateCategory;
module.exports.categorySchema = categorySchema;
