const blogModel = require("../../db/models/blog.model")
const myHelper = require("../../app/helper")
const fs = require("fs")

class Blog{
    //   @description : Get All Blogs Data
    //   @method : GET /api/blog/
    //   @access : public 
    static allBlogs = async(req,res) => {
        try{
            const blogsData = await blogModel.find()
            myHelper.resHandler(res, 200, true, blogsData, "blogs fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get All user Blogs Data
    //   @method : GET /api/blog/myBlogs
    //   @access : private/user 
    static myBlogs = async(req,res) => {
        try{
            const blogsData = await blogModel.find({user:req.user._id})
            myHelper.resHandler(res, 200, true, blogsData, "blogs fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add a new blog
    //   @method : POST /api/blog/addBlog
    //   @access : private/user 
    static addBlog = async(req,res) => {
        try{
            const blogData = new blogModel({
                user: req.user._id,
                ...req.body
            })
            if(req.body.blogType != "txt")
            { 
                if(!req.file) throw new Error("no file found")
                const ext = req.file.originalname.split(".").pop()
                const newName = "uploads/blogs/"+Date.now()+"laVie."+ext
                fs.renameSync(req.file.path, newName)
                blogData.image = newName
            }
            await blogData.save()
            myHelper.resHandler(res, 200, true, blogData, "blog added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get single blog by its _id
    //   @method : Get /api/blog/singleBlog/:id
    //   @access : public 
    static singleBlog = async(req, res)=>{
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("blog not found")
            myHelper.resHandler(res, 200, true, blogData,"blog fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Edit blog by its _id
    //   @method : PUT /api/blog/editBlog
    //   @access : private/user
    static editBlog = async(req, res)=>{
        try
        {
            let blogData = await blogModel.findOneAndUpdate({user:req.user._id, _id:req.params.id}, req.body, {new:true})
            if(!blogData) throw new Error("blog not found")
            myHelper.resHandler(res, 200, true, blogData, "blog updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete a blog by its _id
    //   @method : DELETE /api/blog/deleteBlog
    //   @access : private/user
    static deleteBlog = async(req, res)=>{
        try
        {
            let blogData = await blogModel.findOneAndDelete({user:req.user._id, _id:req.params.id})
            if(!blogData) throw new Error("blog not found")
            myHelper.resHandler(res, 200, true, null, "blog deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

    //   blogs Recommendations
    //   @description : Get All blogs Recommendations Data
    //   @method : GET /api/blog/recommendations/:cat
    //   @access : private/user 
    static recommendedBlogs = async(req,res) => {
        try{
            const blogsData = await blogModel.find({
                level:req.user.level
            })
            myHelper.resHandler(res, 200, true, blogsData, "blogs fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   blog Reviews
    //   @description : Add a blog review
    //   @method : POST /api/blog/review/addReview/:id
    //   @access : private/user
    static addReview = async(req,res) => {
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("blog not found")

            if(!blogData.reviews) blogData.reviews = []
            const alreadyReviewed = await blogData.reviews.find(review => review.user.toString() == req.user._id.toString())
            if (alreadyReviewed) throw new Error('you already reviewed this blog')

            blogData.reviews.push({user: req.user._id, reviewDate:Date.now(), ...req.body})
            blogData.numReviews += 1
            blogData.rating = await blogData.reviews.reduce(( prev , cur) => cur.rating + prev, 0) / blogData.numReviews
            
            await blogData.save()
            myHelper.resHandler(res, 200, true, blogData.reviews, "Review has been added")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static blogReviews = async(req,res) => {
        try{
            const blogData = await blogModel.findById(req.params.id)
            if(!blogData) throw new Error("blog not found")
            myHelper.resHandler(res, 200, true, blogData.reviews, "Review fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singleReview = async(req,res) => {
        try{
            const blogData = await blogModel.findById(req.params.bID)
            if(!blogData) throw new Error("blog not found")
            if(!blogData.reviews) blogData.reviews = []
            const reviewData = await blogData.reviews.find(review => review._id.toString() == req.params.rID.toString())
            if (!reviewData) throw new Error('review not found')
            myHelper.resHandler(res, 200, true, reviewData, "Review fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


}
module.exports = Blog