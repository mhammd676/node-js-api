
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return  res.status(401).json('Not authorized to access this route')
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWY_SECRET);

    const user = await User.findById(decoded.id);
    if(!user)
    {
    return res.status(404).json({ message: "The user is not found"});
    }
    
    req.user = user ;
    next();
  } catch (err) {
    return res.status(401).json('Not authorized to access this route 22')
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
         ` User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};




























// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;


//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token,process.env.JWT_SECRET); 
//     const user = await User.findById(decoded.id);

//     if (!user || user.token !== token) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }

//     req.user = user;
//     next(); 
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized: Token error' });
//   }
// };

// module.exports = authMiddleware;

