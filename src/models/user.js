const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model('User', dataSchema);
