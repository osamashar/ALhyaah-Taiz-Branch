const express = require('express');
const upload = require('../config/multer');
const FileController = require('../controllers/fileController');

const router = express.Router();

// رفع الملفات
router.post('/upload', upload.single('file'), FileController.uploadSingle);
router.post('/upload-multiple', upload.array('files', 10), FileController.uploadMultiple);

// جلب الملفات
router.get('/', FileController.getAllFiles);
router.get('/stats', FileController.getStats);
router.get('/search', FileController.searchFiles);
router.get('/:id', FileController.getFile);

// حذف
router.delete('/:id', FileController.deleteFile);

module.exports = router;