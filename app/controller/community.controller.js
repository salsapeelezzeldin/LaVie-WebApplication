const communityModel = require("../../db/models/community.model")
const myHelper = require("../../app/helper")
const fs = require("fs")

class Community{
    //   @description : Get All Communities Data
    //   @method : GET /api/community/
    //   @access : public 
    static allCommunities = async(req,res) => {
        try{
            const communitiesData = await communityModel.find()
            myHelper.resHandler(res, 200, true, communitiesData, "communities fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get All user Communities Data
    //   @method : GET /api/community/myCommunities
    //   @access : private/user 
    static myCommunities = async(req,res) => {
        try{
            const communitiesData = await communityModel.find({user:req.user._id})
            myHelper.resHandler(res, 200, true, communitiesData, "communities fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add a new community
    //   @method : POST /api/community/addCommunity
    //   @access : private/user 
    static addCommunity = async(req,res) => {
        try{
            if(!req.file) throw new Error("no file found")
            const ext = req.file.originalname.split(".").pop()
            const newName = "uploads/community/images/"+Date.now()+"laVie."+ext
            fs.renameSync(req.file.path, newName)

            const communityData = new communityModel({
                user: req.user._id,
                image: newName,
                ...req.body
            })
            await communityData.save()
            myHelper.resHandler(res, 200, true, communityData, "community added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get single community by its _id
    //   @method : Get /api/community/singleCommunity/:id
    //   @access : public 
    static singleCommunity = async(req, res)=>{
        try{
            const communityData = await communityModel.findById(req.params.id)
            if(!communityData) throw new Error("community not found")
            myHelper.resHandler(res, 200, true, communityData,"community fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Edit community by its _id
    //   @method : PUT /api/community/editCommunity
    //   @access : private/user
    static editCommunity = async(req, res)=>{
        try
        {
            let communityData = await communityModel.findOneAndUpdate({user:req.user._id, _id:req.params.id}, req.body, {new:true})
            if(!communityData) throw new Error("community not found")
            myHelper.resHandler(res, 200, true, communityData, "community updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete a community by its _id
    //   @method : DELETE /api/community/deleteCommunity
    //   @access : private/user
    static deleteCommunity = async(req, res)=>{
        try
        {
            let communityData = await communityModel.findOneAndDelete({user:req.user._id, _id:req.params.id})
            if(!communityData) throw new Error("community not found")
            myHelper.resHandler(res, 200, true, null, "community deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

    //   communitys Recommendations
    //   @description : Get All communitys Recommendations Data
    //   @method : GET /api/community/recommendations
    //   @access : private/user 
    static recommendedCommunities = async(req,res) => {
        try{
            const communitiesData = await communityModel.find({
                level:req.user.level
            })
            myHelper.resHandler(res, 200, true, communitiesData, "communities fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   community Users
    //   @description : join a community
    //   @method : POST /api/community/join/:id
    //   @access : private/user
    static joinCommunity = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.id)
            if(!communityData) throw new Error("community not found")

            if(!communityData.users) communityData.users = []
            const alreadyJoined = await communityData.users.find(User => User.user.toString() == req.user._id.toString())
            if (alreadyJoined) throw new Error('you already joined this community')

            communityData.users.push({user: req.user._id, joinDate:Date.now()})
            communityData.numUsers += 1

            await communityData.save()
            myHelper.resHandler(res, 200, true, communityData.users, "user joined successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static communityUsers = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.id)
            if(!communityData) throw new Error("community not found")
            myHelper.resHandler(res, 200, true, communityData.users, "community users fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   community posts
    //   @description : add post to a community
    //   @method : POST /api/community/addPost/:id
    //   @access : private/user
    static addCommunityPost = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.id)
            if(!communityData) throw new Error("community not found")
            if(!communityData.posts) communityData.posts = []
            
            communityData.posts.push({user: req.user._id, postType:req.body.postType, postDate:Date.now(), content:req.body.content})
            communityData.numPosts += 1
            await communityData.save()
            myHelper.resHandler(res, 200, true, communityData.posts, "post added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static communityPosts = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.id)
            if(!communityData) throw new Error("community not found")
            myHelper.resHandler(res, 200, true, communityData.posts, "community users fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singlePost = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.cID)
            if(!communityData) throw new Error("community not found")
            if(!communityData.posts) communityData.posts = []
            const postData = await communityData.posts.find(post => post._id.toString() == req.params.pID.toString())
            if (!postData) throw new Error('post not found')
            myHelper.resHandler(res, 200, true, postData, "post fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   community post Reviews
    //   @description : Add a post review
    //   @method : POST /api/community/post/addReview/:cID/:pID
    //   @access : private/user
    static addReview = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.cID)
            if(!communityData) throw new Error("community not found")
            if(!communityData.posts) communityData.posts = []
            let thePost
            await communityData.posts.forEach((post) =>{
                if(post._id == req.params.pID){
                    thePost = post
                }
            })
            if (!thePost) throw new Error('post not found')
            if(!thePost.reviews) thePost.reviews = []
            const alreadyReviewed = await thePost.reviews.find(review => review.user.toString() == req.user._id.toString())
            if (alreadyReviewed) throw new Error('you already reviewed this post')

            thePost.reviews.push({user: req.user._id, reviewDate:Date.now(), ...req.body})
            thePost.numReviews += 1
            thePost.rating = await thePost.reviews.reduce(( prev , cur) => cur.rating + prev, 0) / thePost.numReviews
            
            await communityData.save()
            myHelper.resHandler(res, 200, true, thePost.reviews, "Review has been added")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static postReviews = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.cID)
            if(!communityData) throw new Error("community not found")
            if(!communityData.posts) communityData.posts = []
            const postData = await communityData.posts.find(post => post._id.toString() == req.params.pID.toString())
            if (!postData) throw new Error('post not found')

            myHelper.resHandler(res, 200, true, postData.reviews, "Reviews fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singleReview = async(req,res) => {
        try{
            const communityData = await communityModel.findById(req.params.cID)
            if(!communityData) throw new Error("community not found")
            if(!communityData.posts) communityData.posts = []
            const postData = await communityData.posts.find(post => post._id.toString() == req.params.pID.toString())
            if (!postData) throw new Error('post not found')

            if(!postData.reviews) postData.reviews = []
            const reviewData = await postData.reviews.find(review => review._id.toString() == req.params.rID.toString())
            if (!reviewData) throw new Error('review not found')
            myHelper.resHandler(res, 200, true, reviewData, "Review fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

}
module.exports = Community