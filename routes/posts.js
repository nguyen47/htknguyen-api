const multer = require("multer");
const slugify = require("slugify");
const { Post, validate, validateComment } = require("../models/posts");
const { Category } = require("../models/categories");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().sort("created_at");
  res.send(posts);
});

// Setting for upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  // Check errors
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Find category's id
  const categoryFounded = await Category.findById(req.body.categoryId);
  if (!categoryFounded) {
    res.status(400).send("Category with the given Id not found");
  }

  // Upload image using multer
  console.log(req.file);

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
    image: req.body.image
  });

  // Save to database
  // post = await post.save();

  res.send(post);
});

module.exports = router;
