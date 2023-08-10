const multer = require('multer');

// Khởi tạo Multer và định nghĩa thư mục lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/images');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    // Tạo tên file mới cho ảnh (có thể sử dụng timestamp hoặc mã duy nhất)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});
const fileFilter = function(req, file, cb) {
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    return cb(new Error('Only JPEG and PNG files are allowed'));
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter });

module.exports = upload;
