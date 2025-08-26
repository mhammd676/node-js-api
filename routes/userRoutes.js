const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateDetails,
  // updatePhoto
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/user');

// إرفاق middleware الحماية لجميع المسارات التالية
router.use(protect);
router.use(authorize('admin'));
router.get('/getUsers' , getUsers);



// router
//   .route('/')
//   .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// مسارات خاصة بالتحديثات الشخصية
// router.put('/updatedetails', updateDetails);
// router.put('/updatephoto', updatePhoto);

module.exports = router;