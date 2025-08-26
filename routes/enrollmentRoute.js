const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  getEnrollmentStats,
  cancelEnrollment,
  getCourseEnrollments
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// تطبيق middleware الحماية على جميع المسارات
router.use(protect);

// مسارات الطلاب
router.post('/:courseId', enrollCourse);
router.get('/mycourses', getMyCourses);
router.put('/:enrollmentId/progress', updateProgress);
// router.delete('/:enrollmentId', cancelEnrollment);

// مسارات المدرسين والإدارة
// router.get('/stats', authorize('instructor', 'admin'), getEnrollmentStats);
// router.get('/course/:courseId', authorize('instructor', 'admin'), getCourseEnrollments);

module.exports = router;