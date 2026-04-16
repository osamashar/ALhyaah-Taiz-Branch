const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: String,
    default: 'anonymous',
  },
});

module.exports = mongoose.model('File', fileSchema);