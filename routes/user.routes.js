const router = require("express").Router()
const User = require('../app/controller/user.controller')
const Auth = require("../app/middleware/auth.middleware")
const upload = require("../app/middleware/fileUpload.middleware")


//auth
router.post("/register", User.register)
router.post("/sendVarifyCode", User.sendVarifyCode)
router.post("/varifyEmail", User.varifyEmail)
router.post("/login", User.login)

//logout
router.post("/logout",Auth.authentication, User.logOut)
//logout all
router.post("/logoutall",Auth.authentication, User.logOutAll)

//forgot password
router.post("/forgotPassword", User.forgotPassword)
//reset password
router.post("/resetPassword", User.resetPassword)


//profile
router.get("/me",Auth.authentication, User.profile)
//edit my profile
router.put("/editprofile",Auth.authentication, User.editProfile)
//delete me
router.delete("/deleteProfile",Auth.authentication, User.deleteProfile)
//change password
router.post("/changePassword",Auth.authentication, User.changePassword)
//change profile picture
router.patch("/profilePic",Auth.authentication, upload.single("img"), User.profilePic)


//add level
router.post("/level",Auth.authentication, User.editLevel)
//edit my level
router.put("/level",Auth.authentication, User.editLevel)
//get my level
router.get("/level",Auth.authentication, User.getLevel)
//delete my level
router.delete("/level",Auth.authentication, User.deleteLevel)


//Manage Users
//all Users
router.get("/",Auth.authentication, Auth.restrictTo("admin"), User.allUsers)
//get single user
router.get("/single/:id",Auth.authentication, User.singleUser)
//add new user
router.post("/adduser",Auth.authentication, Auth.restrictTo("admin"), User.adduser)
//edit other users
router.put("/edituser/:id",Auth.authentication, Auth.restrictTo("admin"), User.edituser)
//delete user
router.delete("/deleteUser/:id",Auth.authentication, Auth.restrictTo("admin"), User.deleteUser)


//shopping cart
//add item to shopping cart
router.post("/cart/addItem/:id",Auth.authentication, Auth.restrictTo("user"), User.addItemToCart)
//delete item from shopping cart
router.delete("/cart/deleteItem/:id",Auth.authentication, Auth.restrictTo("user"), User.deleteItem)
router.delete("/cart/decreaseItem/:id",Auth.authentication, Auth.restrictTo("user"), User.decreaseItemfromCart)
//get shopping cart
router.get("/cart/",Auth.authentication, Auth.restrictTo("user"), User.getShoppingCart)


//BookMarks
//add BookMark
router.post("/bookMark/add/:type/:id",Auth.authentication, Auth.restrictTo("user"), User.addToBookMark)
//my BookMarks
router.get("/bookMark",Auth.authentication, Auth.restrictTo("user"), User.myBookMarks)
//single BookMark
router.get("/bookMark/:id",Auth.authentication, Auth.restrictTo("user"), User.singleBookMark)
//router.get("/bookMark/:type/:id",Auth.authentication, User.singleBookMark)
//delete BookMark
router.delete("/bookMark/:id",Auth.authentication, Auth.restrictTo("user"), User.deleteBookMark)

//Quizes
//taken quizes
router.get("/quiz",Auth.authentication, Auth.restrictTo("user"), User.takenQuizes)
//take a quiz
router.post("/quiz/takeQuiz/:id",Auth.authentication, Auth.restrictTo("user"), User.takeQuiz)


//Rewards
//my rewards
router.get("/reward/myRewards",Auth.authentication, Auth.restrictTo("user"), User.myRewards)
//user rewards
router.get("/rewards/:id",Auth.authentication, Auth.restrictTo("user"), User.userRewards)


module.exports = router