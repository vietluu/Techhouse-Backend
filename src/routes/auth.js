const router = require('express').Router();
// const controller = require('../controllers/auth');
const { loginByUsernamePassword } = require('../controllers/auth');
const APIError = require('../utils/error');
const { isNumber } = require('../utils/util');
const authUser = require('../middleware/auth');

const maxTokenExpireTime = 60 * 24 * 30; // 30 days

// login user
router.post('/login', authUser, async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;
    let { expiresInMins = 60 } = req.body;

    if (!isNumber(expiresInMins)) expiresInMins = 60;

    // if asking for more than maxTokenExpireTime, deny!
    if (expiresInMins > maxTokenExpireTime) {
      throw new APIError(
        `maximum token expire time can be ${maxTokenExpireTime} minutes`,
      );
    }
    let payload;
    if (email) {
      payload = await loginByUsernamePassword({
        username: email,
        password,
        expiresInMins,
      });
    } else {
      payload = await loginByUsernamePassword({
        username: phoneNumber,
        password,
        expiresInMins,
      });
    }

    res.send(payload);
  } catch (error) {
    next(error);
  }
});
// router.post('/register', async (req, res) => {
//   await controller.register(req, res);
// });
// router.post('/resend-code', async (res, req) => {
//   await controller.ResendCode(res, req);
// });
// router.post('/verify', async (req, res) => {
//   await controller.verify(req, res);
// });

module.exports = router;
