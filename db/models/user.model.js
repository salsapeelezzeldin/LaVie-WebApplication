const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const otpGenerator = require('otp-generator')

const userSchema = mongoose.Schema({
    email:{
        type:String, 
        trim:true,
        lowercase:true,
        required:true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format")
            }
        }
    }, 
    password:{
        type:String, 
        trim:true,
        minLength: 5,
        required:true
    },
    fullName:{
        type:String, 
        trim:true,
        required:true,
        minLength: 3,
        maxLength:50
    }, 
    roleName:{
        type:String,
        trim:true,
        lowercase: true,
        default:"user",
        enum:["admin", "user", "professional", "shop"]
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    varifications:[
        {
            code:{
                type:String, 
                trim:true
            },
            createdAt:{
                type: Date,
            },
            expiresAt:{
                type: Date,
            }
        }
    ],
    image:{
        type:String, 
        trim:true
    }, 
    age:{
        type:Number,
        min:1,
        max:100
    },  
    gender:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["male", "female"]
    }, 
    dOfBirth:{
        type: Date
    }, 
    education:{
        type:String, 
        trim:true,
        lowercase:true
    }, 
    phoneNumbers:[{
        numberType:{
            type:String, 
            trim:true,
            required:true
        },
        phoneNumber:{
            type: String,
            validate(value){
            if(!validator.isMobilePhone(value, "ar-EG"))
                throw new Error ("invalid number")
            }
        }
    }],
    country:{
        type:String, 
        trim:true,
        lowercase:true
    },
    city:{
        type:String, 
        trim:true,
        lowercase:true
    },
    location:{
        type:String, 
        trim:true
    },
    level:{
        type:String, 
        trim:true,
        lowercase:true,
        enum: ["beginner", "advanced" , "professional"]
    }, 
    tokens:[{
        token:{ type:String, required:true}
    }],
    shoppingCart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    CartTotalPrice:{
        type: Number,
        default: 0.0
    },
    bookMarks: [{
        bookMarkType:{
            type:String,
            enum:["blog", "plant", "seed", "shop"],
            required:true,
            trim:true,
            lowercase:true
        },
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
            required: function(){
                return this.bookMarkType=="blog"
            }
        },
        plant:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: function(){
                return this.bookMarkType=="plant"
            }
        },
        seed:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: function(){
                return this.bookMarkType=="seed"
            }
        },
        shop:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: function(){
                return this.bookMarkType=="shop"
            }
        }
    }],
    userQuizes: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Quiz'
        },
        userAnswers: [],
        TakenAt:{
            type: Date
        },
        status:{
            type: Boolean,
            default: false
        }
    }],
    rewards: [{
        code: {
            type: String,
        },
        points: {
            type: Number
        },
        createdAt:{
            type: Date,
        },
        expiresAt:{
            type: Date,
        }
    }]
}, {
    timestamps:true
})

userSchema.pre("save", async function(){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }
})
userSchema.statics.loginUser = async(email, password) => {
    const userData = await User.findOne({email})
    if(!userData) throw new Error("invalid email")
    if(!userData.isVarified) throw new Error("email is not varified")
    const validatePassword = await bcryptjs.compare(password, userData.password)
    if(!validatePassword) throw new Error("invalid password")
    return userData
}
userSchema.methods.toJSON = function(){
    const data = this.toObject()
    delete data.__v
    delete data.password
    delete data.tokens
    return data
}
userSchema.methods.generateToken = async function(){
    const userData = this
    const token = jwt.sign({_id: userData._id}, process.env.tokenPassword)
    userData.tokens = userData.tokens.concat({token})
    await userData.save()
    return token
}
userSchema.methods.generateVarifyCode = async function(){
    const userData = this
    userData.varifications = []
    const OTP_CONFIG = {
        upperCaseAlphabets: true,
        specialChars: false,
    }
    const OTP_LENGTH = 5
    const code = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    const createdAt = Date.now()
    const expiresAt = Date.now() + 7200
    userData.varifications = userData.varifications.concat({code, createdAt, expiresAt})
    await userData.save()
    return code
}
userSchema.methods.generateDiscountCode = async function(points){
    const userData = this
    const OTP_CONFIG = {
        upperCaseAlphabets: true,
        specialChars: false,
    }
    const OTP_LENGTH = 5
    const code = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
    const createdAt = Date.now()
    const expiresAt = Date.now() + 657600000
    userData.rewards = userData.rewards.concat({code, points, createdAt, expiresAt})
    await userData.save()
    return code
}

const User = mongoose.model("User", userSchema)
module.exports=User