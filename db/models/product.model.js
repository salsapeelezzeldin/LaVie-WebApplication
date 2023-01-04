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
})

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        trim:true,
        required: true
    },
    image: {
        type: String,
        trim:true,
        //required: true
    },
    level:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["beginner", "advanced" , "professional"]
    }, 
    category: {
        type: String,
        required: true,
        trim:true,
        lowercase:true,
        enum:["plant","seed"]
    },
    description: {
        type: String,
        required: true,
        trim:true,
    },
    price: {
        type: Number,
        required: true
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
    countInStock: {
        type: Number,
        required: true
    },
    numOf5StarsReviews: {
        type: Number,
        default: 0
    },
    numOf4StarsReviews: {
        type: Number,
        default: 0
    },
    numOf3StarsReviews: {
        type: Number,
        default: 0
    },
    numOf2StarsReviews: {
        type: Number,
        default: 0
    },
    numOf1StarsReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema)
module.exports = Product