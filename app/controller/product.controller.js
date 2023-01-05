const productModel = require("../../db/models/product.model")
const orderModel = require("../../db/models/order.model")
const myHelper = require("../../app/helper")
const fs = require("fs")


class Product{
    //   @description : Get All Products Data
    //   @method : GET /api/product/
    //   @access : public 
    static allProducts = async(req,res) => {
        try{
            const productsData = await productModel.find()
            myHelper.resHandler(res, 200, true, productsData, "products fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get All user Products Data
    //   @method : GET /api/product/myProducts
    //   @access : private/shop 
    static myProducts = async(req,res) => {
        try{
            const productsData = await productModel.find({user:req.user._id})
            myHelper.resHandler(res, 200, true, productsData, "products fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Add a new product
    //   @method : POST /api/product/addProduct
    //   @access : private/shop 
    static addProduct = async(req,res) => {
        try{
            if(!req.file) throw new Error("no file found")
            const ext = req.file.originalname.split(".").pop()
            const newName = "uploads/products/"+Date.now()+"laVie."+ext
            fs.renameSync(req.file.path, newName)
            const productData = new productModel({
                user: req.user._id,
                image: newName,
                ...req.body
            })
            await productData.save()
            myHelper.resHandler(res, 200, true, productData, "product added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : get single product by its _id
    //   @method : Get /api/product/singleProduct/:id
    //   @access : public 
    static singleProduct = async(req, res)=>{
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("product not found")
            myHelper.resHandler(res, 200, true, productData,"product fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Edit product by its _id
    //   @method : PUT /api/product/editProduct
    //   @access : private/shop
    static editProduct = async(req, res)=>{
        try
        {
            let productData = await productModel.findOneAndUpdate({user:req.user._id, _id:req.params.id}, req.body, {new:true})
            if(!productData) throw new Error("product not found")
            myHelper.resHandler(res, 200, true, productData, "product updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Delete a product by its _id
    //   @method : DELETE /api/product/deleteProduct
    //   @access : private/shop
    static deleteProduct = async(req, res)=>{
        try
        {
            let productData = await productModel.findOneAndDelete({user:req.user._id, _id:req.params.id})
            if(!productData) throw new Error("product not found")
            myHelper.resHandler(res, 200, true, null, "product deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

    //   Products Recommendations
    //   @description : Get All Products Recommendations Data
    //   @method : GET /api/product/recommendations/:cat
    //   @access : private/user 
    static recommendedProducts = async(req,res) => {
        try{
            const productsData = await productModel.find({
                level:req.user.level,
                category:req.params.cat
            })
            myHelper.resHandler(res, 200, true, productsData, "products fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


    //   Product Reviews
    //   @description : Add a product review
    //   @method : POST /api/product/review/addReview/:id
    //   @access : private/user
    static addReview = async(req,res) => {
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("product not found")

            const ordersData = await orderModel.find({user:req.user._id})
            let existedProduct
            await ordersData.forEach(order => {
                order.orderItems.forEach(item => {
                    if(item.product == req.params.id) existedProduct = item
                })
            })
            if(!existedProduct) throw new Error("you can not review this product")

            if(!productData.reviews) productData.reviews = []
            const alreadyReviewed = await productData.reviews.find(review => review.user.toString() == req.user._id.toString())
            if (alreadyReviewed) throw new Error('you already reviewed this product')

            productData.reviews.push({user: req.user._id, reviewDate:Date.now(), ...req.body})
            productData.numReviews += 1
            productData.rating = await productData.reviews.reduce(( prev , cur) => cur.rating + prev, 0) / productData.numReviews
            
            await productData.save()
            myHelper.resHandler(res, 200, true, productData.reviews, "Review has been added")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static productReviews = async(req,res) => {
        try{
            const productData = await productModel.findById(req.params.id)
            if(!productData) throw new Error("product not found")
            myHelper.resHandler(res, 200, true, productData.reviews, "Review fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singleReview = async(req,res) => {
        try{
            const productData = await productModel.findById(req.params.pID)
            if(!productData) throw new Error("product not found")
            if(!productData.reviews) productData.reviews = []
            const reviewData = await productData.reviews.find(review => review._id.toString() == req.params.rID.toString())
            if (!reviewData) throw new Error('review not found')
            myHelper.resHandler(res, 200, true, reviewData, "Review fetched")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }


}
module.exports = Product