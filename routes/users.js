const _ = require("lodash");
const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  // All comment

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

module.exports = router;
