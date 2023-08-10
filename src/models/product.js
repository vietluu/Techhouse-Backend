const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  descripption: {
    required: true,
    type: String,
  },
  thumbnail: {
    require: true,
    type: String,
  },
  images: [
    {
      type: String,
      require: true,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: null,
  },
  stock: {
    type: Number,
    default: 0,
  },
  rateting: {
    type: Number,
    default: 0,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', dataSchema);
