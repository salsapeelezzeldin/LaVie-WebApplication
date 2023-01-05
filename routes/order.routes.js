const router = require("express").Router()
const Order = require('../app/controller/order.controller')
const Auth = require("../app/middleware/auth.middleware")

//all Orders
router.get("/",Auth.authentication, Auth.restrictTo("admin"), Order.allOrders)
//my Orders
router.get("/myOrders",Auth.authentication, Auth.restrictTo("user"), Order.myPreviousOrders)
//add Order
router.post("/addOrder",Auth.authentication, Auth.restrictTo("user"), Order.addOrder)
//single Order
router.get("/singleOrder/:id",Auth.authentication, Auth.restrictTo("user","admin"), Order.singleOrder)
//delete Order
router.delete("/deleteOrder/:id",Auth.authentication, Auth.restrictTo("user"), Order.deleteOrder)

//varify Order
router.put("/varifyOrder/:id",Auth.authentication,Auth.restrictTo("user"),  Order.varifyOrder)

module.exports = router