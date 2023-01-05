const router = require("express").Router()
const Community = require('../app/controller/community.controller')
const Auth = require("../app/middleware/auth.middleware")
const upload = require("../app/middleware/fileUpload.middleware")

//all Communities
router.get("/",Auth.authentication, Community.allCommunities)
//my Communities
router.get("/myCommunities",Auth.authentication,Auth.restrictTo("professional"), Community.myCommunities)
//add Community
router.post("/addCommunity",Auth.authentication,Auth.restrictTo("professional"), upload.single("img"), Community.addCommunity)
//single Community
router.get("/singleCommunity/:id",Auth.authentication, Community.singleCommunity)
//edit Community
router.put("/editCommunity/:id",Auth.authentication, Auth.restrictTo("professional"), Community.editCommunity)
//delete Community
router.delete("/deleteCommunity/:id",Auth.authentication, Auth.restrictTo("professional"), Community.deleteCommunity)


//Community recommendations
router.get("/recommendations",Auth.authentication, Community.recommendedCommunities)


//Community users
//all Community user
router.get("/users/:id",Auth.authentication, Community.communityUsers)
//add Community revisew
router.post("/join/:id",Auth.authentication, Community.joinCommunity)


//Community posts
//all Community posts
router.get("/posts/:id",Auth.authentication, Community.communityPosts)
//add Community post
router.post("/addPost/:id",Auth.authentication, Community.addCommunityPost)
//single Community post
router.get("/singlePost/:cID/:pID",Auth.authentication, Community.singlePost)


module.exports = router