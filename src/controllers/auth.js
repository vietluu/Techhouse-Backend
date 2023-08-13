const Nexmo = require('nexmo');
const APIError = require('../utils/error');
const { generateToken } = require('../utils/jwt');
const model = require('../models/user');

const nexmo = new Nexmo({
  apiKey: '33c95fcc',
  apiSecret: 'pJjGptjjGbAXrOM1',
  applicationId: 'a5316519-6b30-4a7a-8c6a-e27eddacff0e',
});
console.log(nexmo.verify);
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

controller.register = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(nexmo);
  try {
    const result = await nexmo.verify.request({
      number: phoneNumber,
      brand: 'Techhouse',
      code_length: '6',
    });

    console.log(result);
    res
      .status(200)
      .send(`Verification code sent with request ID: ${result.request_id}`);
  } catch (err) {
    res.status(500).send('Error sending verification code');
  }
};

controller.resendCode = async (req, res) => {
  const { requestId } = req.body;

  try {
    const result = await nexmo.verify.control({
      request_id: requestId,
      cmd: 'trigger_next_event',
    });

    const { status } = result;
    if (status === '0') {
      res.status(200).send('Verification successful');
    } else {
      res.status(401).send('Verification failed');
    }
  } catch (err) {
    res.status(500).send('Error verifying verification code');
  }
};

controller.verify = async (req, res) => {
  const { requestId, code, name, phoneNumber, password } = req.body;

  try {
    const result = await nexmo.verify.check({ request_id: requestId, code });

    const { status } = result;
    if (status === '0') {
      await model.create({ name, phoneNumber, password });
      res.status(200).send('Verification successful');
    } else {
      res.status(401).send('Verification failed');
    }
  } catch (err) {
    res.status(500).send('Error verifying verification code');
  }
};

module.exports = controller;
