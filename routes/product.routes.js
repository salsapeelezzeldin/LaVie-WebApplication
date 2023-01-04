const router = require("express").Router()
const Product = require('../app/controller/product.controller')
const Auth = require("../app/middleware/auth.middleware")

//all products
router.get("/",Auth.authentication, Product.allProducts)
//my products
router.get("/myProducts",Auth.authentication, Product.myProducts)
//add product
router.post("/addProduct",Auth.authentication, Product.addProduct)
//single product
router.get("/singleProduct/:id",Auth.authentication, Product.singleProduct)
//edit product
router.put("/editProduct/:id",Auth.authentication, Product.editProduct)
//delete product
router.delete("/deleteProduct/:id",Auth.authentication, Product.deleteProduct)


//product recommendations
router.get("/recommendations/:cat",Auth.authentication, Product.recommendedProducts)


//Product Reviews
//all products
router.get("/review/:id",Auth.authentication, Product.productReviews)
//add product
router.post("/review/addReview/:id",Auth.authentication, Product.addReview)
//single product
router.get("/review/singleReview/:pID/:rID",Auth.authentication, Product.singleReview)
// //edit product
// router.put("/editProduct/:id",Auth.authentication, Product.editProduct)
// //delete product
// router.delete("/deleteProduct/:id",Auth.authentication, Product.deleteProduct)

module.exports = router