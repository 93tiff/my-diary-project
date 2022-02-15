const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: String,
});

module.exports = mongoose.model("Post", postSchema);
