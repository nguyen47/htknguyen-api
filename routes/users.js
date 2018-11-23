// Get
// Detail
// Delete
const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  // All comment

  res.send(users);
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
