const router = require("express").Router()
const Product = require('../app/controller/product.controller')
const Auth = require("../app/middleware/auth.middleware")
const upload = require("../app/middleware/fileUpload.middleware")

//all products
router.get("/",Auth.authentication, Product.allProducts)
//my products
router.get("/myProducts",Auth.authentication, Auth.restrictTo("shop"), Product.myProducts)
//add product
router.post("/addProduct",Auth.authentication, Auth.restrictTo("shop"), upload.single("img"),Product.addProduct)
//single product
router.get("/singleProduct/:id",Auth.authentication, Product.singleProduct)
//edit product
router.put("/editProduct/:id",Auth.authentication, Auth.restrictTo("shop"), Product.editProduct)
//delete product
router.delete("/deleteProduct/:id",Auth.authentication, Auth.restrictTo("shop"), Product.deleteProduct)


//product recommendations
router.get("/recommendations/:cat",Auth.authentication, Auth.restrictTo("user"), Product.recommendedProducts)


//Product Reviews
//all product reviews
router.get("/review/:id",Auth.authentication, Product.productReviews)
//add product review
router.post("/review/addReview/:id",Auth.authentication, Auth.restrictTo("user"), Product.addReview)
//single product review
router.get("/review/singleReview/:pID/:rID",Auth.authentication, Product.singleReview)

module.exports = router