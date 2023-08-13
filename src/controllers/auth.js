const APIError = require('../utils/error');
const { generateToken } = require('../utils/jwt');
const model = require('../models/user');

const controller = {};

controller.loginByUsernamePassword = async data => {
  const { username, password, expiresInMins } = data;
  const user = await model
    .findOne({ email: username.toLowerCase(), password })
    .select('+password');

  if (!user) {
    throw new APIError('Invalid credentials', 400);
  }

  const payload = {
    id: user.id,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  try {
    const token = await generateToken(payload, expiresInMins);
    return { token };
  } catch (err) {
    throw new APIError(err.message, 400);
  }
};

module.exports = controller;
