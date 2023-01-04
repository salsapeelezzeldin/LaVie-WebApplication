const mongoose = require("mongoose")

const quizSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    level:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["beginner", "advanced" , "professional"]
    }, 
    title: {
        type: String,
        trim:true,
        required: true
    },
    numQuestions: {
        type: Number,
        required: true
    },
    questions:[{
        question:{
            type: String,         
            trim: true,
            required: true
        },
        choises:[{
            choise:{
                type: String,         
                trim: true,
                required: true
            }
        }],
        answer:{
            type: String,         
            trim: true,
            required: true
        }
    }],
    points: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz