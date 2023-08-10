const APIError = require('../utils/error');
const { generateToken } = require('../utils/jwt');

const model = require('../models/user');

const controller = {};

// login user by username and password
controller.loginByUsernamePassword = async data => {
  const { email, password, expiresInMins } = data;
  console.log(email, password);
  const user = await model.findOne({
    email: email.toLowerCase(),
    password,
  });

  if (!user) {
    throw new APIError(`Invalid credentials`, 400);
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };

  try {
    const token = await generateToken(payload, expiresInMins);

    return {
      token,
    };
  } catch (err) {
    throw new APIError(err.message, 400);
  }
};

module.exports = controller;
