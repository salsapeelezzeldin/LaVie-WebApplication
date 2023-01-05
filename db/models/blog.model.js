const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,         
        trim: true,
        required: true
    },
    reviewDate: {
        type: String
    }
}, {
    timestamps: true
});

const blogSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    blogType:{
        type:String,
        enum:["txt", "file"],
        required:true,
        trim:true,
        lowercase:true
    },
    content:{
        type:String,
        required: function(){
            return this.blogType=="txt"
        }
    },
    image:{
        type:String,
        required: function(){
            return this.blogType!="txt"
        }
    },
    level:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["beginner", "advanced" , "professional"]
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog