
const Course = require('../models/course')
const ErrorResponse = require('../utils/errorResponse')


exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().populate('instructor')
        res.status(200).json(
            {
                success: true,
                count: courses.length,
                data: courses
            }
        )
    } catch (error) {
        next(error)
    }

}

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email')
        if (!course) {
            return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
        }
        res.status(200).json(
            {
                success: true,
                data: course
            }
        )
    } catch (error) {
        next(error)
    }
}

exports.createCourse = async (req, res, next) => {
    req.body.instructor = req.user.id
    try {
        const course = await Course.create(req.body)
        res.status(201).json(
            {
                success: true,
                data: course
            }
        )

    } catch (error) {
    next(error)
    }
}

exports.deletCourse = async (req , res , next) =>
{
 await Course.findByIdAndDelete(req.params.id);
      res.status(200).json({
    success: true,
    data: {}
  });
}