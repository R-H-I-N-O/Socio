const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory for easy upload
const upload = multer({ storage: storage });

module.exports = upload;