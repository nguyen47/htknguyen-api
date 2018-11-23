const { categorySchema } = require("../models/categories");
const { userSchema } = require("../models/users");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true
  },
  subject: {
    type: String
  },
  content: {
    type: String,
    required: true
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  slug: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isPublish: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [],
  comments: [commentSchema],
  category: {
    type: categorySchema,
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

const Post = mongoose.model("Post", postSchema);

function validatePost(posts) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(255)
      .required(),
    slug: Joi.string(),
    content: Joi.string().required(),
    categoryId: Joi.string().required(),
    tags: Joi.array(),
    isPublish: Joi.boolean()
  };

  return Joi.validate(posts, schema);
}

function validateComment(comments) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(255)
      .required(),
    email: Joi.email(),
    website: Joi.string(),
    content: Joi.string().required()
  };

  return Joi.validate(comments, schema);
}

function validateImage(image) {
  const schema = {
    image: Joi.string().required()
  };

  return Joi.validate(image, schema);
}

module.exports.Post = Post;
module.exports.validate = validatePost;
module.exports.validateComment = validateComment;
module.exports.validateImage = validateImage;
