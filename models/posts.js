const slug = require("slug");
const { Category } = require("../models/categories");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  email: {
    type: String
  },
  website: {
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
    type: String,
    default: slug(this.title)
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
  tags: [
    {
      name: {
        type: String
      }
    }
  ],
  comments: [commentSchema],
  category: {
    type: Category,
    required: true
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
    views: Joi.number(),
    image: Joi.string().required(),
    content: Joi.string().required(),
    categoryId: Joi.required().string()
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

module.exports.Post = Post;
module.exports.validate = validatePost;
module.exports.validateComment = validateComment;
