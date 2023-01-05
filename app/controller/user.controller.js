const userModel = require("../../db/models/user.model")
const productModel = require("../../db/models/product.model")
const blogModel = require("../../db/models/blog.model")

const myHelper = require("../../app/helper")
const mailHelper = require("../../app/sendmail.helper")

const fs = require("fs")
const moment = require('moment')


class User{
    //   @description : Register as a new user
    //   @method : POST /api/user/register
    //   @access : public 
    static register = async(req,res) => {
        try{
            if(req.body.password.length<6) throw new Error("password must be more than 6")
            if(req.body.fullName.split(" ").length > 2) throw new Error("name must not exceed 2 words")
            const userData = new userModel(req.body)
            await userData.save()
            const code = await userData.generateVarifyCode()
            await mailHelper.sendEmail(req.body.email, "Varification Mail", 
                                        `<h1>Welcome ${req.body.fullName}</h1>
                                        <p>Varify your email to complete the signup process.</p>
                                        <p>Your code is <b>${code}</b></p>
                                        <p>This code <b>expires in 2 hours</b>!</p>`)
            myHelper.resHandler(res, 200, true, null, "user registered successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : send Varify Code Again
    //   @method : POST /api/user/sendVarifyCode
    //   @access : public 
    static sendVarifyCode = async(req,res) => {
        try{
            const userData = await userModel.findOne({email:req.body.email})
            if(!userData) throw new Error("Email not found")
            if(userData.isVarified) throw new Error("Email is already varified")
            const code = await userData.generateVarifyCode()
            await mailHelper.sendEmail(req.body.email, "Varification Mail", 
                                        `<h1>Welcome ${req.body.fullName}</h1>
                                        <p>Varify your email to complete the signup process.</p>
                                        <p>Your code is <b>${code}</b></p>
                                        <p>This code <b>expires in 2 hours</b>!</p>`)
            myHelper.resHandler(res, 200, true, null, "email sent successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : varify Email
    //   @method : POST /api/user/varifyEmail
    //   @access : public 
    static varifyEmail = async(req,res) => {
        try{
            const userData = await userModel.findOne({email:req.body.email})
            if(!userData) throw new Error("Email not found")
            if(userData.isVarified) throw new Error("email already varified")
            if(userData.varifications[0].code != req.body.code) throw new Error("code is not correct")
            if(userData.varifications[0].expiresAt > Date.now()) throw new Error("code expired")
            userData.isVarified = true
            userData.varifications = []
            userData.save()
            myHelper.resHandler(res, 200, true, null, "Email varified successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Auth user & get token 
    //   @method : POST /api/user/login
    //   @access : public 
    static login = async(req,res) => {
        try{
            const userData = await userModel.loginUser(req.body.email, req.body.password)
            const token = await userData.generateToken()
            myHelper.resHandler(res, 200, true, {user:userData, token}, "user logged successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : logout current user token 
    //   @method : POST /api/user/logout
    //   @access : private 
    static logOut = async(req,res)=>{
        try{
            req.user.tokens = req.user.tokens.filter(tok => tok.token != req.token )
            await req.user.save()
            myHelper.resHandler(res, 200, true,null,"logged out successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : logout current user all tokens 
    //   @method : POST /api/user/logoutall
    //   @access : private 
    static logOutAll = async(req,res)=>{
        try{
            req.user.tokens = []
            await req.user.save()
            myHelper.resHandler(res, 200, true,null,"logged out all successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : send code to user email who forgot password 
    //   @method : POST /api/user/forgotPassword
    //   @access : public 
    static forgotPassword = async(req,res) => {
        try{
            const userData = await userModel.findOne({email:req.body.email})
            if(!userData) throw new Error("Email not found")
            const code = await userData.generateVarifyCode()
            await mailHelper.sendEmail(req.body.email, "Varification Mail", 
                                        `<h1>Welcome ${req.body.fullName}</h1>
                                        <p>Varify your email to complete the signup process.</p>
                                        <p>Your code is <b>${code}</b></p>
                                        <p>This code <b>expires in 2 hours</b>!</p>`)
            myHelper.resHandler(res, 200, true, null, "email sent successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : user re enter the code to reset password 
    //   @method : POST /api/user/resetPassword
    //   @access : public 
    static resetPassword = async(req,res) => {
        try{
            const userData = await userModel.findOne({email:req.body.email})
            if(!userData) throw new Error("Email not found")
            if(userData.varifications[0].code != req.body.code) throw new Error("code is not correct")
            if(userData.varifications[0].expiresAt > Date.now()) throw new Error("code expired")
            userData.password = req.body.password
            userData.varifications = []
            await userData.save()
            myHelper.resHandler(res, 200, true, userData, "user added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get current logged in user profile
    //   @method : GET /api/user/me
    //   @access : private 
    static profile = (req,res)=>{        
        try{
            myHelper.resHandler(res, 200, true,{user: req.user},"user profile fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : edit current logged in user profile
    //   @method : PUT /api/user/editprofile
    //   @access : private 
    static editProfile = async(req,res)=>{
        try
        {
            await req.user.updateOne({...req.body})
            myHelper.resHandler(res, 200, true, req.user, "profile updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : delete current logged in user profile
    //   @method : DELETE /api/user/deleteProfile
    //   @access : private 
    static deleteProfile = async(req,res)=>{
        try
        {
            await req.user.deleteOne()
            myHelper.resHandler(res, 200, true, null, "profile deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : change password for logged in user
    //   @method : POST /api/user/changePassword
    //   @access : private 
    static changePassword = async(req,res)=>{
        try
        {   
            req.user.password = req.body.password
            await req.user.save()
            myHelper.resHandler(res, 200, true, req.user, "profile updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description :upload profile picture for logged in user
    //   @method : PATCH /api/user/profilePic
    //   @access : private 
    static profilePic = async(req,res)=>{
        try{
            if(!req.file) throw new Error("no file found")
            const ext = req.file.originalname.split(".").pop()
            const newName = "uploads/profile"+Date.now()+"laVie."+ext
            fs.renameSync(req.file.path, newName)
            req.user.image = newName
            await req.user.save()
            myHelper.resHandler(res, 200, true, req.user, "profile picture updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add or Edit level for current logged in user
    //   @method : POST/PUT /api/user/level
    //   @access : private 
    static editLevel = async(req,res)=>{
        try
        {
            await req.user.updateOne({level: req.body.level})
            myHelper.resHandler(res, 200, true, req.user.level, "level updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get level for current logged in user
    //   @method : GET /api/user/level
    //   @access : private 
    static getLevel = async(req,res)=>{
        try
        {
            myHelper.resHandler(res, 200, true, req.user.level, "level fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete level for current logged in user
    //   @method : DELETE /api/user/level
    //   @access : private 
    static deleteLevel = async(req,res)=>{
        try
        {
            await req.user.updateOne({level: ""})
            myHelper.resHandler(res, 200, true, "", "level deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   Admins
    //   @description : Get all users for Admin
    //   @method : GET /api/user/
    //   @access : private/admin 
    static allUsers = async(req,res) => {
        try{
            const userData = await userModel.find()
            myHelper.resHandler(res, 200, true, userData, "users fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get a single user based on its _id
    //   @method : GET /api/user/single/:id
    //   @access : private/admin 
    static singleUser = async(req, res)=>{
        try{
            const user = await userModel.findById(req.params.id)
            if(!user) throw new Error("user not found")
            myHelper.resHandler(res, 200, true,user,"user fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add a new user
    //   @method : POST /api/user/adduser
    //   @access : private/admin 
    static adduser = async(req,res) => {
        try{
            if(req.body.password.length<6) throw new Error("password must be more than 6")
            const userData = new userModel(req.body)
            await userData.save()
            myHelper.resHandler(res, 200, true, userData, "user added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Edit a single user based on its _id
    //   @method : PUT /api/user/edituser/:id
    //   @access : private/admin 
    static edituser = async(req,res)=>{
        try
        {
            let userData = await userModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
            if(!userData) throw new Error("user not found")
            myHelper.resHandler(res, 200, true, userData, "user updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete a user based on its _id
    //   @method : DELETE /api/user/deleteUser/:id
    //   @access : private/admin 
    static deleteUser = async(req,res)=>{
        try
        {
            let userData = await userModel.findByIdAndDelete(req.params.id)
            if(!userData) throw new Error("user not found")
            myHelper.resHandler(res, 200, true, null, "user deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   Shopping Cart
    //   @description : Add an Item to the Shopping Cart
    //   @method : POST /api/user/cart/addItem/:id
    //   @access : private/user
    static addItemToCart = async(req,res)=>{
        try
        {
            if (!req.user.shoppingCart) req.user.shoppingCart = []
            const existedItem = req.user.shoppingCart.find(item => item.product == req.params.id)
            if (existedItem) existedItem.quantity++
            else req.user.shoppingCart.push({product:req.params.id})
            const userData = await req.user.populate("shoppingCart.product")
            userData.CartTotalPrice = 0
            userData.shoppingCart.forEach(i=>{
                userData.CartTotalPrice += i.product.price * i.quantity
            })
            await userData.save()
            myHelper.resHandler(res, 200, true, {Cart:userData.shoppingCart,CartTotalPrice:userData.CartTotalPrice}, "item added")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : delete an Item from the Shopping Cart
    //   @method : Delete /api/user/cart/deleteItem/:id
    //   @access : private/user
    static deleteItem = async(req,res)=>{
        try
        {
            const itemIndex = req.user.shoppingCart.findIndex(item => item.product == req.params.id)
            if(itemIndex == -1) throw new Error("item not found")
            await req.user.shoppingCart.splice(itemIndex,1)
            const userData = await req.user.populate("shoppingCart.product")
            userData.CartTotalPrice = 0
            userData.shoppingCart.forEach(i=>{
                userData.CartTotalPrice += i.product.price * i.quantity
            })
            await userData.save()
            myHelper.resHandler(res, 200, true, {Cart:userData.shoppingCart,CartTotalPrice:userData.CartTotalPrice}, "item deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : decrease an Item from the Shopping Cart
    //   @method : Delete /api/user/cart/decreaseItem/:id
    //   @access : private/user
    static decreaseItemfromCart = async(req,res)=>{
        try
        {
            let existedItem, itemIndex
            req.user.shoppingCart.forEach((item, index) =>{
                if(item.product == req.params.id){
                    existedItem = item
                    itemIndex = index
                }
            })
            if (!existedItem) throw new Error("item not found")
            if(existedItem.quantity == 1){
                await req.user.shoppingCart.splice(itemIndex,1)
            }
            else existedItem.quantity--
            const userData = await req.user.populate("shoppingCart.product")
            userData.CartTotalPrice = 0
            userData.shoppingCart.forEach(i=>{
                userData.CartTotalPrice += i.product.price * i.quantity
            })
            await userData.save()
            myHelper.resHandler(res, 200, true, {Cart:userData.shoppingCart,CartTotalPrice:userData.CartTotalPrice}, "item removed")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get all Items from the Shopping Cart
    //   @method : GET /api/user/cart/
    //   @access : private/user
    static getShoppingCart = async(req,res)=>{
        try
        {
            const userData = await req.user.populate("shoppingCart.product")
            if(userData.shoppingCart.length == 0 ) throw new Error("Shopping Cart is empty");
            userData.CartTotalPrice = 0
            userData.shoppingCart.forEach(i=>{
                userData.CartTotalPrice += i.product.price * i.quantity
            })
            await userData.save()
            myHelper.resHandler(res, 200, true, {Cart:userData.shoppingCart,CartTotalPrice:userData.CartTotalPrice}, "shopping Cart fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   BookMarks
    //   @description : Add Item to bookmarks
    static addToBookMark = async(req,res)=>{
        try
        {
            if(!req.user.bookMarks) req.user.bookMarks = []
            const existedItem = req.user.bookMarks.find(mark => mark.bookMarkType == req.params.type && 
                (mark.blog == req.params.id || mark.plant == req.params.id || 
                mark.seed == req.params.id || mark.shop == req.params.id))
            if(existedItem) throw new Error("already added")

            let item
            if (req.params.type == "blog"){
                item = await blogModel.findOne({_id:req.params.id})
                if(!item) throw new Error("blog not found")
                req.user.bookMarks.push({bookMarkType:"blog", blog:req.params.id})
            } 
            if (req.params.type == "plant"){
                item = await productModel.findOne({_id:req.params.id, category:req.params.type})
                if(!item) throw new Error("plant not found")
                req.user.bookMarks.push({bookMarkType:"plant", plant:req.params.id})
            } 
            if (req.params.type == "seed"){
                item = await productModel.findOne({_id:req.params.id, category:req.params.type})
                if(!item) throw new Error("seed not found")
                req.user.bookMarks.push({bookMarkType:"seed", seed:req.params.id})
            }
            if (req.params.type == "shop"){
                item = await userModel.findOne({_id:req.params.id, roleName:"shop"})
                if(!item) throw new Error("shop not found")
                req.user.bookMarks.push({bookMarkType:"shop", shop:req.params.id})
            } 
            await req.user.save()
            await req.user.populate("bookMarks.blog")
            await req.user.populate("bookMarks.plant")
            await req.user.populate("bookMarks.seed")
            await req.user.populate("bookMarks.shop")
            myHelper.resHandler(res, 200, true, req.user.bookMarks, "bookmark added")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static myBookMarks = async(req,res)=>{
        try
        {
            if(!req.user.bookMarks) req.user.bookMarks = []
            await req.user.populate("bookMarks.blog")
            await req.user.populate("bookMarks.plant")
            await req.user.populate("bookMarks.seed")
            await req.user.populate("bookMarks.shop")
            myHelper.resHandler(res, 200, true, req.user.bookMarks, "bookmarks fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singleBookMark = async(req,res)=>{
        try
        {
            if(!req.user.bookMarks) req.user.bookMarks = []
            const bookMarked = await req.user.bookMarks.find(mark => mark._id == req.params.id)
            if(!bookMarked) throw new Error("bookmark not found")
        
            await req.user.populate("bookMarks.blog")
            await req.user.populate("bookMarks.plant")
            await req.user.populate("bookMarks.seed")
            await req.user.populate("bookMarks.shop")
            myHelper.resHandler(res, 200, true, bookMarked, "bookmark fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    // static singleBookMark = async(req,res)=>{
    //     try
    //     {
    //         if(!req.user.bookMarks) req.user.bookMarks = []
    //         const bookMarked = await req.user.bookMarks.find(mark => mark.bookMarkType == req.params.type && 
    //             (mark.blog == req.params.id || mark.plant == req.params.id || 
    //             mark.seed == req.params.id || mark.shop == req.params.id))
    //         if(!bookMarked) throw new Error("bookmark not found")
            
    //         if(req.params.type == "blog") await req.user.populate("bookMarks.blog")
    //         if(req.params.type == "plant") await req.user.populate("bookMarks.plant")
    //         if(req.params.type == "seed") await req.user.populate("bookMarks.seed")
    //         if(req.params.type == "shop") await req.user.populate("bookMarks.shop")
    //         myHelper.resHandler(res, 200, true, bookMarked, "bookmark fetched")
    //     }
    //     catch(e){
    //         myHelper.resHandler(res, 500, false, e, e.message)
    //     }
    // }
    static deleteBookMark = async(req,res)=>{
        try
        {
            if(!req.user.bookMarks) req.user.bookMarks = []
            let bookMarked, index
            await req.user.bookMarks.forEach((mark,indx) =>{
                if(mark._id == req.params.id){
                    bookMarked = mark
                    index = indx
                }
            })
            if(!bookMarked) throw new Error("bookmark not found")
            req.user.bookMarks.splice(index, 1)
            await req.user.save()
            myHelper.resHandler(res, 200, true, null, "bookmark deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    

    //   user Quizes
    //   @description : get all user taken quizes
    //   @method : GET /api/user/quiz/
    //   @access : private/user
    static takenQuizes = async(req,res)=>{
        try
        {
            const userData = await req.user.populate("userQuizes.quiz")
            if(!userData.userQuizes) userData.userQuizes = []
            myHelper.resHandler(res, 200, true, userData.userQuizes, "quized fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : take a quiz
    //   @method : POST /api/user/quiz/takeQuiz/:id
    //   @access : private/user
    static takeQuiz = async(req,res)=>{
        try
        {
            if(!req.user.userQuizes) req.user.userQuizes = []

            let todayQuizes = []
            req.user.userQuizes.forEach(Quiz =>{
                if( moment(Quiz.TakenAt).format('YYYY-MM-DD') == moment(Date.now()).format('YYYY-MM-DD'))
                    todayQuizes.push(Quiz)
            })
            if (todayQuizes.length >= 2) throw new Error("you can take up to two quizzes per day")

            let existedQuiz
            req.user.userQuizes.forEach(Quiz =>{
                if( Quiz.quiz.toString() == req.params.id.toString())
                    existedQuiz = Quiz
            })
            if (existedQuiz) throw new Error("Quiz already taken")
            req.user.userQuizes.push({quiz:req.params.id, TakenAt:Date.now(), ...req.body})
            
            const userData = await req.user.populate("userQuizes.quiz")
            const userQuiz = userData.userQuizes[req.user.userQuizes.length-1]

            let quizAns = [], flag = 0
            userQuiz.quiz.questions.forEach(ans => quizAns.push(ans.answer))
            userQuiz.userAnswers.forEach((ans,indx) =>{
                if(quizAns[indx] == ans) flag++
            })

            let msg
            if(flag == userQuiz.quiz.questions.length){
                userQuiz.status = true
                const code = await req.user.generateDiscountCode(userQuiz.quiz.points)
                msg = `Quiz Passed Successfully, your discount code is ${code}`
            }
            else msg = `Failed to pass quiz, Answers is ${quizAns}`
            await req.user.save()
            myHelper.resHandler(res, 200, true, req.user, msg)
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   user Rewards
    //   @description : get all my rewards
    //   @method : GET /api/user/rewards/:id
    //   @access : private/user
    static myRewards = async(req,res)=>{
        try
        {
            myHelper.resHandler(res, 200, true, req.user.rewards, "rewards fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get all user rewards
    //   @method : GET /api/user/rewards/:id
    //   @access : private/admin
    static userRewards = async(req,res)=>{
        try
        {
            const userData = await userModel.findById(req.params.id)
            if(!userData) throw new Error("user not found")
            myHelper.resHandler(res, 200, true, userData.rewards, "rewards fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

}
module.exports = User