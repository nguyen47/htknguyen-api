const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const categoriesRouter = require("./routes/categories");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

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

app.use("/api/categories", categoriesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
module.exports = app;
