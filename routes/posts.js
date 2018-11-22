const fs = require("fs");
const { upload } = require("../config/imageSetting");
const slugify = require("slugify");
const { Post, validate, validateComment } = require("../models/posts");
const { Category } = require("../models/categories");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().sort("created_at");
  res.send(posts);
});

router.post("/", upload.single("image"), async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (!req.file) {
    return res.status(400).send("'image'   is required");
  }

  // Find category's id
  const categoryFounded = await Category.findById(req.body.categoryId);
  if (!categoryFounded) {
    return res.status(400).send("Category with the given Id not found");
  }

  // Save to database title, slug, content, isPublish, tags, category
  let post = new Post({
    title: req.body.title,
    slug: slugify(req.body.title), // url: date/month/year/slug
    content: req.body.content,
    isPublish: req.body.isPublish,
    tags: req.body.tags,
    category: {
      _id: categoryFounded._id,
      title: categoryFounded.title
    },
    image: req.file.path
  });

  post = await post.save();

  res.send(post);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400).send("Post with given Id not found");
  }

  if (req.file) {
    console.log(req.file.path);
    fs.stat(post.image, (err, stats) => {
      if (err) {
        return console.error(err);
      }
      fs.unlink(post.image, function(err) {
        if (err) return console.log(err);
      });
    });
  }

  res.send("Work");
});

module.exports = router;
