const productModel = require("../../db/models/product.model")
const myHelper = require("../../app/helper")

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
            const productData = new productModel({
                user: req.user._id,
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

}
module.exports = Product