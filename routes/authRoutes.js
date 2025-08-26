const express = require('express');
const router = express.Router();
const {
  register,
  login,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// مسارات المصادقة
router.post('/register', register);
router.post('/login', login);

// مسارات استعادة كلمة المرور
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

// المسارات المحمية (تتطلب تسجيل دخول)
// router.use(protect); // جميع المسارات التالية ستتطلب مصادقة

// router.put('/updatepassword', updatePassword);

module.exports = router;