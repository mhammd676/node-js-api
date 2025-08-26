const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // خطأ MongoDB CastError (معرف غير صحيح)
  if (err.name === 'CastError') {
    const message =` المورد غير موجود بالمعرف ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // تكرار قيمة فريدة في MongoDB
  if (err.code === 11000) {
    const message = 'قيمة مكررة تم إدخالها';
    error = new ErrorResponse(message, 400);
  }

  // خطأ تحقق MongoDB
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'حدث خطأ في الخادم'
  });
};

module.exports = errorHandler;