# 📁 نظام رفع الملفات الاحترافي

نظام متقدم لرفع الملفات يوفر واجهة استخدام احترافية مع ميزات متعددة.

## ✨ الميزات الرئيسية

- ✅ **Drag & Drop** - سحب وإفلات الملفات
- ✅ **Progress Bar** - شريط تقدم فعلي
- ✅ **Multiple File Upload** - رفع ملفات متعددة في نفس الوقت
- ✅ **File Preview** - معاينة الملفات
- ✅ **RESTful API** - واجهة برمجية منظمة
- ✅ **MongoDB Database** - حفظ البيانات
- ✅ **Multer** - معالجة محترفة للملفات
- ✅ **File Validation** - التحقق من الملفات
- ✅ **Responsive Design** - تصميم متجاوب
- ✅ **Arabic Support** - دعم كامل للعربية

## 📋 المتطلبات

- Node.js v14 أو أحدث
- MongoDB
- npm أو yarn

## 🚀 التثبيت والتشغيل

### 1. استنساخ المستودع
```bash
git clone https://github.com/osamashar/ALhyaah-Taiz-Branch.git
cd ALhyaah-Taiz-Branch
```

### 2. تثبيت المكتبات
```bash
npm install
```

### 3. إعداد ملف .env
```bash
cp .env.example .env
```

ثم عدّل `MONGODB_URI` بناءً على إعداداتك:
```env
MONGODB_URI=mongodb://localhost:27017/alhyaah-uploads
PORT=5000
NODE_ENV=development
```

### 4. التشغيل

**للتطوير (مع Nodemon):**
```bash
npm run dev
```

**للإنتاج:**
```bash
npm start
```

سيظهر الرسالة:
```
🚀 الخادم يعمل على المنفذ 5000
✅ متصل بقاعدة البيانات
```

## 📁 هيكل المشروع

```
ALhyaah-Taiz-Branch/
│
├── server.js                      # الخادم الرئيسي
├── package.json                   # المكتبات
├── .env.example                   # متغيرات البيئة
├── .gitignore                     # ملفات التجاهل
│
├── config/
│   └── database.js                # إعدادات قاعدة البيانات
│
├── models/
│   └── File.js                    # نموذج الملف
│
├── routes/
│   └── fileRoutes.js              # مسارات API
│
├── uploads/                       # مجلد الملفات المرفوعة
│
├── public/
│   ├── index.html                 # الصفحة الرئيسية
│   ├── css/
│   │   └── style.css              # الأنماط
│   └── js/
│       └── upload.js              # منطق الرفع
│
└── README-UPLOAD-SYSTEM.md        # هذا الملف
```

## 🔌 واجهة API

### 1. رفع ملف واحد
**POST** `/api/files/upload`

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/upload \
  -F "file=@path/to/file.pdf" \
  -F "uploadedBy=username"
```

**Response:**
```json
{
  "success": true,
  "message": "تم رفع الملف بنجاح",
  "file": {
    "_id": "63d4a8f5e9f1c2a1b3c4d5e6",
    "filename": "1674990837321-document.pdf",
    "originalname": "document.pdf",
    "mimetype": "application/pdf",
    "size": 2048576,
    "filepath": "uploads/1674990837321-document.pdf",
    "url": "/uploads/1674990837321-document.pdf",
    "uploadedAt": "2023-01-29T10:47:17.329Z"
  }
}
```

### 2. رفع ملفات متعددة
**POST** `/api/files/upload-multiple`

**Request:**
```bash
curl -X POST http://localhost:5000/api/files/upload-multiple \
  -F "files=@file1.pdf" \
  -F "files=@file2.jpg" \
  -F "uploadedBy=username"
```

**Response:**
```json
{
  "success": true,
  "message": "تم رفع 2 ملفات بنجاح",
  "files": [...]
}
```

### 3. الحصول على قائمة الملفات
**GET** `/api/files`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "files": [
    {
      "_id": "63d4a8f5e9f1c2a1b3c4d5e6",
      "filename": "1674990837321-document.pdf",
      "originalname": "document.pdf",
      "mimetype": "application/pdf",
      "size": 2048576,
      "url": "/uploads/1674990837321-document.pdf",
      "uploadedAt": "2023-01-29T10:47:17.329Z"
    }
  ]
}
```

### 4. الحصول على ملف واحد
**GET** `/api/files/:id`

**Response:**
```json
{
  "success": true,
  "file": {...}
}
```

### 5. حذف ملف
**DELETE** `/api/files/:id`

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الملف بنجاح"
}
```

## 🎨 التصميم والميزات الأمامية

### منطقة الرفع بالسحب والإفلات
- تصميم جذاب وسهل الاستخدام
- رسائل واضحة للمستخدم
- تأثيرات بصرية عند السحب

### عرض الملفات المختارة
- قائمة بالملفات المختارة
- عرض حجم كل ملف
- إمكانية حذف ملفات من القائمة قبل الرفع

### شريط التقدم
- عرض نسبة التقدم الفعلية
- اسم الملف الحالي قيد الرفع
- نسبة مئوية للتقدم

### قائمة الملفات المرفوعة
- عرض جميع الملفات المرفوعة
- أيقونات بناءً على نوع الملف
- تاريخ الرفع
- أزرار التحميل والحذف

## 🔒 الأمان

### التحقق من نوع الملف
الملفات المدعومة:
- الصور: JPEG, PNG, GIF
- المستندات: PDF, Word, Excel
- النصوص: TXT

### الحد الأقصى لحجم الملف
- 50 ميجابايت لكل ملف

### التحقق من البيانات
- التحقق من امتداد الملف
- التحقق من نوع MIME
- حفظ آمن على الخادم

## 📊 نموذج البيانات

### ملف (File Schema)
```javascript
{
  filename: String,           // اسم الملف المحفوظ
  originalname: String,       // اسم الملف الأصلي
  mimetype: String,           // نوع الملف (MIME)
  size: Number,               // حجم الملف بالبايتات
  filepath: String,           // مسار الملف
  url: String,                // عنوان URL للتحميل
  uploadedAt: Date,           // تاريخ الرفع
  uploadedBy: String          // اسم المستخدم
}
```

## 🛠️ التطوير والتخصيص

### إضافة أنواع ملفات جديدة
في `routes/fileRoutes.js`:
```javascript
const allowedMimes = [
  'image/jpeg',
  'application/vnd.ms-powerpoint', // PowerPoint
  'video/mp4'                       // فيديو
];
```

### تغيير حد الحجم
في `routes/fileRoutes.js`:
```javascript
limits: {
  fileSize: 100 * 1024 * 1024 // 100MB
}
```

### تخصيص أسلوب CSS
تعديل المتغيرات في `public/css/style.css`:
```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --danger-color: #e74c3c;
}
```

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module 'express'"
**الحل:** قم بتثبيت المكتبات
```bash
npm install
```

### خطأ: "Failed to connect to MongoDB"
**الحل:** تأكد من:
- تشغيل MongoDB
- صحة `MONGODB_URI` في ملف `.env`

### خطأ: "ENOENT: no such file or directory, mkdir 'uploads'"
**الحل:** أنشئ مجلد uploads
```bash
mkdir uploads
```

### الملفات لا تظهر بعد الرفع
**الحل:** تحقق من:
- أن قاعدة البيانات متصلة
- صلاحيات المجلد `uploads`

## 📚 الموارد الإضافية

### MongoDB
- [الموقع الرسمي](https://www.mongodb.com)
- [الوثائق](https://docs.mongodb.com)

### Express.js
- [الموقع الرسمي](https://expressjs.com)
- [الوثائق](https://expressjs.com/api)

### Multer
- [GitHub Repository](https://github.com/expressjs/multer)
- [الوثائق](https://github.com/expressjs/multer/blob/master/doc/README.md)

## 🤝 المساهمة

نرحب بمساهماتك! يرجى:
1. Fork المستودع
2. إنشاء فرع جديد
3. إرسال Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT

## 👤 الكاتب

**osamashar**
- GitHub: [@osamashar](https://github.com/osamashar)

---

**آخر تحديث:** 2026-04-16