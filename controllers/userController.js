const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');


// @desc    الحصول على جميع المستخدمين
// @access  خاص/مدير
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find(); // جلب كل المستخدمين من قاعدة البيانات
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    الحصول على مستخدم واحد
// @access  خاص/مدير
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`لم يتم العثور على مستخدم بالمعرف ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    إنشاء مستخدم
// @access  خاص/مدير
// exports.createUser = asyncHandler(async (req, res, next) => {
//   const user = await User.create(req.body);

//   res.status(201).json({
//     success: true,
//     data: user
//   });
// });

// @desc    تحديث مستخدم
// @access  خاص/مدير
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
  }

  // تحديث الحقول المرسلة فقط
  const { name, email, password , role  } = req.body;
  if (name == null) {user.name = name} ;
  if (email) user.email = email;
  if (password) user.password = password;
  if(role) user.role = role;
  
  // سيتم تشفيره تلقائيًا عبر الـ pre-save

  await user.save(); // هنا يتم تفعيل pre('save') وبالتالي التشفير
  user.password = undefined;
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    حذف مستخدم
// @access  خاص/مدير
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    تحديث تفاصيل المستخدم
// @access  خاص
// exports.updateDetails = asyncHandler(async (req, res, next) => {
//   const fieldsToUpdate = {
//     name: req.body.name,
//     email: req.body.email
//   };

//   const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
//     new: true,
//     runValidators: true
//   });

//   res.status(200).json({
//     success: true,
//     data: user
//   });
// });

// @desc    تحديث الصورة الشخصية
// @access  خاص
// exports.updatePhoto = asyncHandler(async (req, res, next) => {
//   if (!req.file) {
//     return next(new ErrorResponse('الرجاء رفع صورة', 400));
//   }

//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { photo: req.file.filename },
//     { new: true }
//   );

//   res.status(200).json({
//     success: true,
//     data: user
//   });
// });