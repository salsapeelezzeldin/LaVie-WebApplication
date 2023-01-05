const userModel = require("../../db/models/user.model")
const myHelper = require("../../app/helper")
const jwt = require("jsonwebtoken")

class Auth{
    static authentication = async (req, res, next) => {
        try{
            const token = req.header("Authorization").replace("Bearer ", "")
            const decodedToken = jwt.verify(token, process.env.tokenPassword)
            const userData = await userModel.findOne({
                _id: decodedToken._id,
                "tokens.token": token
            })
            if(!userData) throw new Error("invalid token")
            req.user = userData
            req.token = token
            next()
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e.message, "not authenticated")
        }
    }
    static restrictTo = (...roles)=>{
        return(req, res, next) =>{
            if(!roles.includes(req.user.roleName))
            {
                return myHelper.resHandler(res, 500, false, "un authorized", "you do not have permission")
            }
            next()
        }
    }
}

module.exports = Auth