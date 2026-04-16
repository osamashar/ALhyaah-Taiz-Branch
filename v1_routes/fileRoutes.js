const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');

const router = express.Router();

// إعدادات التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

// التحقق من نوع الملف
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// رفع ملف واحد
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم اختيار ملف' });
    }

    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filepath: req.file.path,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.body.uploadedBy || 'anonymous'
    });

    await newFile.save();
    res.status(201).json({
      success: true,
      message: 'تم رفع الملف بنجاح',
      file: newFile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// رفع ملفات متعددة
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'لم يتم اختيار ملفات' });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const newFile = new File({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        filepath: file.path,
        url: `/uploads/${file.filename}`,
        uploadedBy: req.body.uploadedBy || 'anonymous'
      });
      
      await newFile.save();
      savedFiles.push(newFile);
    }

    res.status(201).json({
      success: true,
      message: `تم رفع ${savedFiles.length} ملفات بنجاح`,
      files: savedFiles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الحصول على قائمة الملفات
router.get('/', async (req, res) => {
  try {
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json({
      success: true,
      count: files.length,
      files: files
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// الحصول على ملف واحد
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }
    res.json({ success: true, file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// حذف ملف
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'الملف غير موجود' });
    }
    
    // حذف الملف من النظام
    const fs = require('fs');
    if (fs.existsSync(file.filepath)) {
      fs.unlinkSync(file.filepath);
    }
    
    res.json({ success: true, message: 'تم حذف الملف بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;