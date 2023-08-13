const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Brand', brandSchema);
