const controller = {};

controller.uploadimage = req => {
  const imagePaths = req.files.map(
    file => `${process.env.SERVERNAME}/uploads/images/${file.filename}`,
  );
  return imagePaths;
};

module.exports = controller;
