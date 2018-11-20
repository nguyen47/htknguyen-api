const { Post } = require("../models/posts");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().sort("created_at");
  res.send(posts);
});
module.exports = router;
