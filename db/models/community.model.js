const mongoose = require("mongoose")

const replySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reply: {
        type: String,         
        trim: true,
        required: true
    },
    replyDate: {
        type: String
    }
}, {
    timestamps: true
});

const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,         
        trim: true,
        required: true
    },
    commentDate: {
        type: String
    },
    replies: [replySchema],
    numReplies: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

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

const postSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    postType:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    content:{
        type:String
    },
    postDate:{
        type: Date
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    numComments: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const communitySchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    name:{
        type:String,
        required: true,
        trim: true,
        unique:true
    },
    image:{
        type:String, 
        trim:true
    }, 
    level:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["beginner", "advanced" , "professional"]
    },
    posts: [postSchema],
    numPosts: {
        type: Number,
        default: 0
    },
    users: [{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
        },
        joinDate:{
            type: Date
        }
    }],
    numUsers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community