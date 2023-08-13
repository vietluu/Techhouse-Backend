const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    require: true,
    type: String,
    select: false,
  },
  image: String,
  phoneNumber: String,
  address: {
    ward: String,
    district: String,
    province: String,
  },
  coupon: [
    {
      info: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
