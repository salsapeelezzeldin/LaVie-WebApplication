const orderModel = require("../../db/models/order.model")
const myHelper = require("../../app/helper")
const mailHelper = require("../../app/sendmail.helper")


class Order{
    //   @description : Get All Orders Data
    //   @method : GET /api/order/
    //   @access : private/admin 
    static allOrders = async(req,res) => {
        try{
            const ordersData = await orderModel.find().populate("orderItems.product")
            if(!ordersData.length) throw new Error("there is no orders yet")
            myHelper.resHandler(res, 200, true, ordersData, "orders fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get user Previous Orders Data
    //   @method : GET /api/order/myOrders
    //   @access : private/user 
    static myPreviousOrders = async(req,res) => {
        try{
            const ordersData = await orderModel.find({user:req.user._id}).populate("orderItems.product")
            if(!ordersData.length) throw new Error("there is no orders yet")
            myHelper.resHandler(res, 200, true, ordersData, "orders fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add a new order
    //   @method : POST /api/order/addOrder
    //   @access : private/user 
    static addOrder = async(req,res) => {
        try{
            if(req.user.shoppingCart.length == 0) 
                throw new Error("shopping cart can not be empty")
            const orderData = new orderModel({
                user: req.user._id,
                orderItems:req.user.shoppingCart,
                totalPrice:req.user.CartTotalPrice,
                ...req.body
            })
            if(req.body.fullName.split(" ").length > 2) 
                throw new Error("name must not exceed 2 words")
            if(req.body.phoneNumbers.length < 2) 
                throw new Error("enter at lest two numbers")
            if(req.body.email !=  req.user.email) 
                throw new Error("please enter your email")
            await orderData.save()
            const code = orderData.generateVarifyCode()
            req.user.shoppingCart = []
            req.user.CartTotalPrice = 0
            await req.user.save()
            const order = await orderModel.findOne(orderData).populate("orderItems.product")
            mailHelper.sendEmail(req.body.email, `Order Details and varification code is ${code}`, order)
            myHelper.resHandler(res, 200, true, order, "order added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : varify order
    //   @method : PUT /api/order/varifyOrder
    //   @access : private/user 
    static varifyOrder = async(req,res) => {
        try{
            const orderData = await orderModel.findOne({
                user: req.user._id,
                _id: req.params.id
                }).populate("orderItems.product")
            if(!orderData) throw new Error("order not found")
            if(orderData.isVarified) throw new Error("order already varified")
            if(orderData.varifyCode != req.body.varifyCode) throw new Error("code is not correct")
            orderData.isVarified = true
            await orderData.save()            
            myHelper.resHandler(res, 200, true, orderData, "order varified successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get single order by its _id
    //   @method : Get /api/order/singleOrder/:id
    //   @access : private 
    static singleOrder = async(req, res)=>{
        try{
            const orderData = await orderModel.findById(req.params.id).populate("orderItems.product")
            if(!orderData) throw new Error("order not found")
            myHelper.resHandler(res, 200, true, orderData,"order fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Edit order by its _id
    //   @method : PUT /api/order/editorder
    //   @access : private/shop
    static editorder = async(req, res)=>{
        try
        {
            let orderData = await orderModel.findOneAndUpdate({user:req.user._id, _id:req.params.id}, req.body, {new:true})
            if(!orderData) throw new Error("order not found")
            myHelper.resHandler(res, 200, true, orderData, "order updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete a order by its _id
    //   @method : DELETE /api/order/deleteOrder/:id
    //   @access : private/shop
    static deleteOrder = async(req, res)=>{
        try
        {
            let orderData = await orderModel.findOneAndDelete({user:req.user._id, _id:req.params.id})
            if(!orderData) throw new Error("order not found")
            myHelper.resHandler(res, 200, true, null, "order deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

}
module.exports = Order