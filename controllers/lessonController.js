const Lesson = require('../models/lesson');
const Course = require('../models/cours');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');

// @desc    إضافة درس جديد
// @route   POST /api/v1/courses/:courseId/lessons
// @access  خاص (مدرس)
exports.addLesson = asyncHandler(async (req, res, next) => {
  req.body.course = req.params.courseId;
  
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    return next(new ErrorResponse(`لا توجد دورة بالمعرف ${req.params.courseId}`, 404));
  }

  // التحقق من أن المستخدم هو مدرس الدورة
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('غير مصرح لك بإضافة دروس لهذه الدورة', 401));
  }

  const lesson = await Lesson.create(req.body);

  res.status(201).json({
    success: true,
    data: lesson
  });
});