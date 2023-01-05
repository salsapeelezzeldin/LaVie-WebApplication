const router = require("express").Router()
const Blog = require('../app/controller/blog.controller')
const Auth = require("../app/middleware/auth.middleware")

//all Blogs
router.get("/",Auth.authentication, Blog.allBlogs)
//my Blogs
router.get("/myBlogs",Auth.authentication, Blog.myBlogs)
//add Blog
router.post("/addBlog",Auth.authentication, Blog.addBlog)
//single Blog
router.get("/singleBlog/:id",Auth.authentication, Blog.singleBlog)
//edit Blog
router.put("/editBlog/:id",Auth.authentication, Blog.editBlog)
//delete Blog
router.delete("/deleteBlog/:id",Auth.authentication, Blog.deleteBlog)


//Blog recommendations
router.get("/recommendations",Auth.authentication, Blog.recommendedBlogs)


//Blog Reviews
//all Blog reviews
router.get("/review/:id",Auth.authentication, Blog.blogReviews)
//add Blog review
router.post("/review/addReview/:id",Auth.authentication, Blog.addReview)
//single Blog review
router.get("/review/singleReview/:bID/:rID",Auth.authentication, Blog.singleReview)


module.exports = router