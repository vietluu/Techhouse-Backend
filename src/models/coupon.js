const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: String,

  discount: Number,

  expiry_date: Date,

  start_date: Date,

  type: String,

  quantity: {
    type: Number,
    default: 1,
  },
});
module.exports = mongoose.model('Coupon', couponSchema);
