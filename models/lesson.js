const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'الرجاء إضافة عنوان للدرس'],
    trim: true,
    maxlength: [100, 'لا يمكن أن يزيد العنوان عن 100 حرف']
  },
  description: {
    type: String,
    required: [true, 'الرجاء إضافة وصف للدرس']
  },
  duration: {
    type: Number,
    required: [true, 'الرجاء تحديد مدة الدرس بالدقائق']
  },
  videoUrl: {
    type: String,
    required: [true, 'الرجاء إضافة رابط الفيديو'],
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'الرجاء استخدام رابط صحيح يحتوي على HTTP أو HTTPS'
    ]
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  section: {
    type: mongoose.Schema.ObjectId,
    ref: 'Section',
    required: [true, 'الدرس يجب أن ينتمي لقسم معين']
  },
  orderInSection: {
    type: Number,
    required: true,
    min: 1
  },
  isFree: {
    type: Boolean,
    default: false
  },
  resources: [
    {
      name: {
        type: String,
        required: [true, 'الرجاء إضافة اسم للمرفق']
      },
      fileUrl: {
        type: String,
        required: [true, 'الرجاء إضافة رابط المرفق']
      },
      type: {
        type: String,
        enum: ['pdf', 'doc', 'zip', 'other'],
        default: 'other'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware للتحقق من أن المدرس هو من يضيف الدرس
lessonSchema.pre('save', async function(next) {
  const course = await this.model('Course').findById(this.course);
  
  if (!course) {
    return next(new ErrorResponse('لا توجد دورة بالمعرف المحدد', 404));
  }

  // التحقق من أن المستخدم الحالي هو مدرس الدورة
  if (this.req && this.req.user && course.instructor.toString() !== this.req.user.id) {
    return next(new ErrorResponse('غير مصرح لك بإضافة دروس لهذه الدورة', 401));
  }

  next();
});

// تحديث تاريخ التعديث قبل أي تحديث
lessonSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// دالة للحصول على تفاصيل الدرس مع معلومات إضافية
lessonSchema.methods.getLessonDetails = async function(userId) {
  const lesson = await this.populate({
    path: 'course',
    select: 'title instructor'
  }).execPopulate();

  const isEnrolled = await this.model('Enrollment').exists({
    user: userId,
    course: lesson.course._id
  });

  return {
    ...lesson.toObject(),
    isEnrolled,
    canAccess: lesson.isFree || isEnrolled
  };
};

module.exports = mongoose.model('Lesson', lessonSchema);