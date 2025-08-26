const User = require('../models/user');
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asynchandler');
// const crypto = require('crypto');
// const sendEmail = require('../utils/sendEmail');


exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashed,
      role
    });
    await user.save();
    const token = generateToken(user)
    user.token = token
    await user.save();

    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      return res.status(400).json({ message: 'Wrong email ' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong paswword ' })
    }
    // 3. استخراج التوكن من الهيدر
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 4. التحقق أن التوكن يطابق المخزن للمستخدم
    if (token !== existingUser.token) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        avatar: existingUser.avatar,
        createdAt: existingUser.createdAt,
        token: existingUser.token
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}


// exports.updatePassword = asyncHandler(async (req, res, next) => {
//   const { currentPassword, newPassword } = req.body;

//   if (!currentPassword || !newPassword) {
//     return next(new ErrorResponse('يرجى إدخال كلمة المرور الحالية والجديدة', 400));
//   }

//   const user = await User.findById(req.user.id).select('+password');

//   const isMatch = await user.matchPassword(currentPassword);

//   if (!isMatch) {
//     return next(new ErrorResponse('كلمة المرور الحالية غير صحيحة', 401));
//   }

//   user.password = newPassword;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });



// exports.forgotPassword = asyncHandler(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return next(new ErrorResponse('لا يوجد مستخدم بهذا البريد الإلكتروني', 404));
//   }

//   // توليد رمز إعادة تعيين عشوائي
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // تشفير الرمز وتخزينه في قاعدة البيانات
//   user.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // تحديد وقت انتهاء صلاحية الرمز، مثلاً 10 دقائق من الآن
//   user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//   await user.save({ validateBeforeSave: false });

//   // هنا ترسل الإيميل للمستخدم مع resetToken (الغير مشفر)
//   // ...

//   res.status(200).json({ success: true, data: 'تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك الإلكتروني' });
// });

//   const resetUrl = `${req.protocol}`;

//   const message = ` لقد تلقيت هذا البريد لأنك (أو شخص آخر) طلبت إعادة تعيين كلمة المرور. 
//   الرجاء الضغط على الرابط التالي: \n\n ${resetUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'رابط إعادة تعيين كلمة المرور',
//       message
//     });

//     res.status(200).json({ success: true, data: 'تم إرسال البريد الإلكتروني' });
//   } catch (err) {
//     console.error(err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorResponse('لم يتم إرسال البريد الإلكتروني، الرجاء المحاولة لاحقاً', 500));
//   }



// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   // الحصول على الرمز المشفر
//   const resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(req.params.resettoken)
//     .digest('hex');
//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() }
//   });

//   if (!user) {
//     return next(new ErrorResponse('رمز غير صالح أو منتهي الصلاحية', 400));
//   }

//   // تعيين كلمة المرور الجديدة
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   sendTokenResponse(user, 200, res);
// });

// // دالة مساعدة لإرسال استجابة بالرمز المميز
// const sendTokenResponse = (user, statusCode, res) => {
//   // إنشاء الرمز المميز
//   const token = generateToken(user)
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true
//   };

//   if (process.env.NODE_ENV === 'production') {
//     options.secure = true;
//   }

//   res
//     .status(statusCode)
//     .cookie('token', token, options)
//     .json({
//       success: true,
//       token
//     });
// };