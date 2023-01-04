const mongoose = require("mongoose")
const validator = require("validator")
const otpGenerator = require('otp-generator')


const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    email:{
        type:String, 
        trim:true,
        lowercase:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format")
            }
        }
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
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
        }
    }],
    shippingAddress: {
        country: {
            type: String,
            trim:true,
            lowercase:true,
            required: true
        },
        city: {
            type: String,
            trim:true,
            lowercase:true,
            required: true
        },
        address: {
            type: String,
            trim:true,
            required: true
        },
        postalCode: {
            type: String,
            trim:true,
            required: true
        }
    },
    paymentMethod: {
        type: String, 
        required: true,
        trim:true,
        lowercase:true,
        enum:["credit card","cash"]
    },
    totalPrice:{
        type: Number,
        default: 0.0
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    varifyCode: {
        type: String, 
        trim:true,
    },
    promoCode: {
        type: String, 
        trim:true,
    }
}, {
    timestamps: true
});

orderSchema.methods.generateVarifyCode = async function(){
    const orderData = this
    const OTP_CONFIG = {
        upperCaseAlphabets: true,
        specialChars: false,
    }
    const OTP_LENGTH = 5
    const Code = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG)
    orderData.varifyCode = Code
    await orderData.save()
    return Code
}

const Order = mongoose.model('Order', orderSchema);
module.exports = Order