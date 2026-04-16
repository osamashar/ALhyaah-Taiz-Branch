class FileUploadManager {
  constructor() {
    this.selectedFiles = [];
    this.uploadInProgress = false;
    this.initializeElements();
    this.attachEventListeners();
  }

  initializeElements() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.fileInfo = document.getElementById('fileInfo');
    this.filesList = document.getElementById('filesList');
    this.uploadBtn = document.getElementById('uploadBtn');
    this.cancelBtn = document.getElementById('cancelBtn');
    this.progressContainer = document.getElementById('progressContainer');
    this.progressFill = document.getElementById('progressFill');
    this.progressPercent = document.getElementById('progressPercent');
    this.progressFile = document.getElementById('progressFile');
    this.messageBox = document.getElementById('messageBox');
    this.uploadedFilesList = document.getElementById('uploadedFilesList');
  }

  attachEventListeners() {
    // منطقة الرفع
    this.uploadArea.addEventListener('click', () => this.fileInput.click());
    this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

    // تغيير الملفات
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // أزرار العمل
    this.uploadBtn.addEventListener('click', () => this.uploadFiles());
    this.cancelBtn.addEventListener('click', () => this.cancelUpload());

    // تحميل الملفات عند الفتح
    this.loadUploadedFiles();
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.uploadArea.classList.add('dragover');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.uploadArea.classList.remove('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    this.fileInput.files = files;
    this.handleFileSelect({ target: { files } });
  }

  handleFileSelect(e) {
    this.selectedFiles = Array.from(e.target.files);
    this.displaySelectedFiles();
  }

  displaySelectedFiles() {
    if (this.selectedFiles.length === 0) {
      this.fileInfo.style.display = 'none';
      return;
    }

    let html = '';
    this.selectedFiles.forEach((file, index) => {
      const size = this.formatFileSize(file.size);
      html += `
        <div class="file-item">
          <div class="file-item-info">
            <div class="file-item-name">📄 ${file.name}</div>
            <div class="file-item-size">${size}</div>
          </div>
          <button class="file-item-remove" onclick="fileUploadManager.removeFile(${index})">
            حذف
          </button>
        </div>
      `;
    });

    this.filesList.innerHTML = html;
    this.fileInfo.style.display = 'block';
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    this.displaySelectedFiles();
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  async uploadFiles() {
    if (this.selectedFiles.length === 0) {
      this.showMessage('رجاء اختيار ملفات أولاً', 'error');
      return;
    }

    this.uploadInProgress = true;
    this.fileInfo.style.display = 'none';
    this.progressContainer.style.display = 'block';

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/files/upload-multiple', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        this.showMessage(`تم رفع ${data.files.length} ملفات بنجاح!`, 'success');
        this.selectedFiles = [];
        this.fileInput.value = '';
        this.progressContainer.style.display = 'none';
        this.loadUploadedFiles();
      } else {
        this.showMessage('حدث خطأ في الرفع', 'error');
      }
    } catch (error) {
      this.showMessage(error.message, 'error');
    } finally {
      this.uploadInProgress = false;
    }
  }

  cancelUpload() {
    this.selectedFiles = [];
    this.fileInput.value = '';
    this.fileInfo.style.display = 'none';
    this.progressContainer.style.display = 'none';
  }

  async loadUploadedFiles() {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();

      if (data.files.length === 0) {
        this.uploadedFilesList.innerHTML = '<p>لا توجد ملفات مرفوعة بعد</p>';
        return;
      }

      let html = '';
      data.files.forEach(file => {
        const date = new Date(file.uploadedAt).toLocaleDateString('ar-SA');
        const icon = this.getFileIcon(file.mimetype);
        html += `
          <div class="file-card">
            <div class="file-icon">${icon}</div>
            <div class="file-name">${file.originalname}</div>
            <div class="file-size">${this.formatFileSize(file.size)}</div>
            <div class="file-date">${date}</div>
            <div class="file-actions">
              <a href="${file.url}" download>تحميل</a>
              <button onclick="fileUploadManager.deleteFile('${file._id}')">حذف</button>
            </div>
          </div>
        `;
      });

      this.uploadedFilesList.innerHTML = html;
    } catch (error) {
      console.error('خطأ في تحميل الملفات:', error);
    }
  }

  getFileIcon(mimetype) {
    if (mimetype.includes('image')) return '🖼️';
    if (mimetype.includes('pdf')) return '📕';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('sheet')) return '📊';
    return '📄';
  }

  async deleteFile(fileId) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.showMessage('تم حذف الملف بنجاح', 'success');
        this.loadUploadedFiles();
      } else {
        this.showMessage('خطأ في حذف الملف', 'error');
      }
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };

    messageEl.innerHTML = `${icons[type]} ${message}`;
    this.messageBox.appendChild(messageEl);

    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }
}

// تهيئة المدير عند تحميل الصفحة
const fileUploadManager = new FileUploadManager();