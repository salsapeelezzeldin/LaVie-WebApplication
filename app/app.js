const express = require("express")
const app = express()

require("../db/connect")

app.use(express.json())


const userRoutes = require("../routes/user.routes")
const blogRoutes = require("../routes/blog.routes")
const productRoutes = require("../routes/product.routes")
const orderRoutes = require("../routes/order.routes")
const quizRoutes = require("../routes/quiz.routes")


app.use("/api/user/",  userRoutes)
app.use("/api/blog/",  blogRoutes)
app.use("/api/product/",  productRoutes)
app.use("/api/order/",  orderRoutes)
app.use("/api/quiz/",  quizRoutes)


app.all("*", (req, res)=> {
    res.status(404).send({
        apisStatus:false,
        message:"Invalid URL",
        data: {}
    })
})

module.exports=app