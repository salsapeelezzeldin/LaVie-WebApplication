const express = require("express")
const path = require("path")
const app = express()

require("../db/connect")

app.use(express.json())
app.use(express.static(path.join(__dirname, "../uploads")))

const userRoutes = require("../routes/user.routes")
const blogRoutes = require("../routes/blog.routes")
const productRoutes = require("../routes/product.routes")
const orderRoutes = require("../routes/order.routes")
const quizRoutes = require("../routes/quiz.routes")
const communityRoutes = require("../routes/community.routes")


app.use("/api/user/",  userRoutes)
app.use("/api/blog/",  blogRoutes)
app.use("/api/product/",  productRoutes)
app.use("/api/order/",  orderRoutes)
app.use("/api/quiz/",  quizRoutes)
app.use("/api/community/",  communityRoutes)


app.all("*", (req, res)=> {
    res.status(404).send({
        apisStatus:false,
        message:"Invalid URL",
        data: {}
    })
})

module.exports=app