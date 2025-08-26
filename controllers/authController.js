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
