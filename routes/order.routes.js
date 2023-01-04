const router = require("express").Router()
const Order = require('../app/controller/order.controller')
const Auth = require("../app/middleware/auth.middleware")

//all Orders
router.get("/",Auth.authentication, Order.allOrders)
//my Orders
router.get("/myOrders",Auth.authentication, Order.myPreviousOrders)
//add Order
router.post("/addOrder",Auth.authentication, Order.addOrder)
//single Order
router.get("/singleOrder/:id",Auth.authentication, Order.singleOrder)
//delete Order
router.delete("/deleteOrder/:id",Auth.authentication, Order.deleteOrder)

//varify Order
router.put("/varifyOrder/:id",Auth.authentication, Order.varifyOrder)

module.exports = router