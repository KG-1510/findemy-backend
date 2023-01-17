const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
  imageurl: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  coursesEnrolled: {
    type: [Object],
    required: false,
  },
  cart: {
    type: [Object],
    required: false,
  },
});

const User = mongoose.model("User", usersSchema);

module.exports = {
  User,
};
