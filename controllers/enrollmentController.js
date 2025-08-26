const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');

//    التسجيل في دورة
//   خاص (طلاب)
exports.enrollCourse = asyncHandler(async (req, res, next) => {
  // التحقق من وجود الدورة
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ErrorResponse(`the cours is available , ${req.params.courseId}`, 404));
  }

  // التحقق من عدم التسجيل مسبقاً
  const existingEnrollment = await Enrollment.findOne({
    user: req.user.id,
    course: req.params.courseId
  });

  if (existingEnrollment) {
    return next(new ErrorResponse('You are registered for the course', 400));
  }

  // إنشاء تسجيل جديد
  const enrollment = await Enrollment.create({
    user: req.user.id,
    course: req.params.courseId
  });

try {
  res.status(201).json(
    {
      success : true ,
      data : enrollment ,
    }
  )
} catch (error) {
  
}
});

//    الحصول على الدورات المسجل بها المستخدم
//   خاص
exports.getMyCourses = asyncHandler(async (req, res, next) => {
  const enrollments = await Enrollment.find({ user: req.user.id })
    .populate({
      path: 'course',
      select: 'title description duration instructor thumbnail',
      populate: {
        path: 'instructor',
        select: 'name'
      }
    });

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

//     تحديث تقدم المستخدم في الدورة
//      خاص
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const { lessonId, completed } = req.body;

  const enrollment = await Enrollment.findById(req.params.enrollmentId);
  if (!enrollment) {
    return next(new ErrorResponse('لا يوجد تسجيل بهذا المعرف', 404));
  }

  // التحقق من أن المستخدم هو صاحب التسجيل
  if (enrollment.user.toString() !== req.user.id) {
    return next(new ErrorResponse('غير مصرح لك بتحديث هذا التسجيل', 401));
  }

  // تحديث التقدم
  if (completed) {
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
  } else {
    enrollment.completedLessons = enrollment.completedLessons.filter(
      id => id.toString() !== lessonId
    );
  }

  // حساب النسبة المئوية للتقدم
  const course = await Course.findById(enrollment.course);
  const totalLessons = await lessonId.countDocuments({ course: course._id });
  enrollment.progress = totalLessons > 0 
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  await enrollment.save();

  res.status(200).json({
    success: true,
    data: enrollment
  });
});

// @desc    الحصول على إحصائيات التسجيل (للمدرسين)
// @route   GET /api/v1/enroll/stats
// @access  خاص (مدرسين)
exports.getEnrollmentStats = asyncHandler(async (req, res, next) => {
  // الحصول على الدورات التي يدرسها المستخدم
  const courses = await Course.find({ instructor: req.User.id });
  const courseIds = courses.map(course => course._id);

 const stats = await Enrollment.aggregate([
    {
      $match: { course: { $in: courseIds } }
    },
    {
      $group: {
        _id: '$course',
        totalEnrollments: { $sum: 1 },
        avgProgress: { $avg: '$progress' }
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: '_id',
        as: 'courseDetails'
      }
    },
    {
      $unwind: '$courseDetails'
    },
    {
      $project: {
        courseTitle: '$courseDetails.title',
        totalEnrollments: 1,
        avgProgress: 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: stats.length,
    data: stats
  });
});