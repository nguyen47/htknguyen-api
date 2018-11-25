const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// Route
const authRouter = require("./routes/auth");
// Admin Routes
const categoriesRouter = require("./routes/admin/categories");
const postsRouter = require("./routes/admin/posts");
const usersRouter = require("./routes/admin/users");
// Client Routes

// Check all environment variables will work
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1); // 0: sucess, another number: fail
}
const app = express();
mongoose
  .connect(
    "mongodb://localhost/blog",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Could not connect to database"));

mongoose.set("useCreateIndex", true);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
// Admin Routes Init
app.use("/api/admin/categories", categoriesRouter);
app.use("/api/admin/posts", postsRouter);
app.use("/api/admin/users", usersRouter);

// Client Routes Init
module.exports = app;
