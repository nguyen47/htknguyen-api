const auth = require("../middleware/auth");
const { Post, validateComment } = require("../models/posts");
const _ = require("lodash");
const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send("User already registered");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  res.send(_.pick(user, ["id", "name", "email"]));
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(400).send("The user with the given ID was not found.");
  }

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  res.send(user);
});

router.post("/comments", auth, async (req, res) => {
  const { error } = validateComment(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let post = await Post.findById(req.body.postId);

  const comment = {
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    },
    subject: req.body.subject,
    content: req.body.content
  };

  post.comments.push(comment);

  post = await post.save();

  res.send(post);
});
module.exports = router;
