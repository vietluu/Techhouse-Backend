const router = require('express').Router();
const upload = require('../utils/upload');
const controller = require('../controllers/upload');

router.post('/', upload.array('images'), async (req, res) => {
  res.send(await controller.uploadimage(req));
});
module.exports = router;
