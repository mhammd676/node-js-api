
const express  = require('express')

const {
    getCourses ,
    getCourse ,
    createCourse,
    deletCourse
} = require('../controllers/courseController')

const {protect , authorize } =require('../middleware/authMiddleware')
const router = express.Router()

router
.route('/').get(getCourses)
.post(protect , authorize('instructor' , 'admin') , createCourse)

router
.route('/:id')
.get(getCourse)
.delete(deletCourse)

module.exports = router ;

