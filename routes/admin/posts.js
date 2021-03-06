const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");
const fs = require("fs");
const { upload } = require("../../config/imageSetting");
const slugify = require("slugify");
const { Post, validate, validateImage } = require("../../models/posts");
const { Category } = require("../../models/categories");
const express = require("express");
const router = express.Router();

router.get("/", [auth, admin], async (req, res) => {
  const posts = await Post.find().sort("created_at");
  res.send(posts);
});

router.post("/", upload.single("image"), async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const validateImage = validateImage(req.file);
  if (!validateImage.error) {
    return res.status(400).send(validateImage.details[0].message);
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

router.put("/:id", [auth, admin], upload.single("image"), async (req, res) => {
  // Validate
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400).send("Post with given Id not found");
  }

  // If image is choose -> Delete the previous one
  if (req.file) {
    fs.stat(post.image, (err, stats) => {
      if (err) {
        return console.error(err);
      }
      fs.unlink(post.image, function(err) {
        if (err) return console.log(err);
      });
    });
  }

  // Find category's id
  const categoryFounded = await Category.findById(req.body.categoryId);
  if (!categoryFounded) {
    return res.status(400).send("Category with the given Id not found");
  }

  // Query fist
  post.title = req.body.title;
  post.slug = slugify(req.body.title);
  post.isPublish = req.body.isPublish;
  post.tags = req.body.tags;
  post.category = {
    _id: categoryFounded._id,
    title: categoryFounded.title
  };
  post.image = req.file.path;

  post = await post.save();

  res.send(post);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const post = await Post.findByIdAndRemove(req.params.id);

  if (!post) {
    return res.status(400).send("Post is not valid");
  }

  res.send(post);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).send("Post with given id not found");
  }
  res.send(post);
});

module.exports = router;
