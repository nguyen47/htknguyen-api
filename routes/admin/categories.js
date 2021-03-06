const admin = require("../../middleware/admin");
const auth = require("../../middleware/auth");
const { Category, validate } = require("../../models/categories");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", [auth, admin], async (req, res) => {
  const categories = await Category.find().sort("title");
  res.send(categories);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let category = new Category({
    title: req.body.title,
    description: req.body.description
  });

  category = await category.save();

  res.send(category);
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description
    },
    {
      new: true
    }
  );

  if (!category) {
    return res
      .status(400)
      .send("The category with the given ID was not found.");
  }

  res.send(category);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(400)
      .send("The category with the given ID was not found.");
  }

  res.send(category);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);
  res.send(category);
});

module.exports = router;
