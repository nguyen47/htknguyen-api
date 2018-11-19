const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024
  },
  isAdmin: {
    type: boolean,
    default: false
  }
});

const User = mongoose.Model("User", UserSchema);

module.exports.User = User;
