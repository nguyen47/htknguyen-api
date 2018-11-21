const multer = require("multer");

// Setting for upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });

module.exports.upload = upload;
