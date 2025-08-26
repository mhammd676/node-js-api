const mongoose = require('mongoose')



const courseSchema = mongoose.Schema(
    {
        title:
        {
            type:String,
            required: [true , 'Please add a title'],
            trim : true ,// delete space 1->9
        },
        description:
        {
            type:String,
            required:[true , "please add a description"]
        },
        weeks:
        {
            type:Number,
            required:[true , "please add a number of weeks"]
        },
        // تكلفة
        tuition:
        {
            type:Number,
            required:[true , "please add a tuition cost"]
        },
        minimumSkill:
        {
            type:String,
            required:[true , 'Please add a mininum skill'],
            enum : ['beginner' , 'intermediate' , 'advanced']
        },
        // منح دراسية متاحة
        scholarhipsAvailable:
        {
            type:Boolean,
            default:false,
        },
        createdAt:
        {
            type:Date ,
            default:Date.now,
        },
        instructor:
        {
            type:mongoose.Schema.ObjectId,
            ref: 'User',
            required :true,
        },
        category:
        {
            type: String ,
            required:[true , 'Please add a category']
        },
        // صورة مصغّرة للدورة
        thumbnail:
        {
            type:String,
            default :'no_photo.jpg'
        },
        videos:[
            {
                title:String,
                url:String,
                duration: String
            }
        ],
    }
);

module.exports = mongoose.model('Course' , courseSchema)