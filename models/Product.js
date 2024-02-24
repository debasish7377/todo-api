const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("product", todoSchema);
