const quizModel = require("../../db/models/quiz.model")
const myHelper = require("../../app/helper")

class Quiz{
    static allQuizes = async(req,res) => {
        try{
            const quizData = await quizModel.find()
            myHelper.resHandler(res, 200, true, quizData, "quizs fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    //   @description : Get All quizes added by user
    //   @method : GET /api/quiz/myQuizes
    //   @access : private/ 
    static myQuizes = async(req,res) => {
        try{
            const quizData = await quizModel.find({user:req.user._id})
            myHelper.resHandler(res, 200, true, quizData, "quizs fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static addQuiz = async(req,res) => {
        try{
            const quizData = new quizModel({user:req.user._id, ...req.body})
            await quizData.save()
            myHelper.resHandler(res, 200, true, quizData, "quiz added successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static singleQuiz = async(req, res)=>{
        try{
            const quizData = await quizModel.findById(req.params.id)
            if(!quizData) throw new Error("quiz not found")
            myHelper.resHandler(res, 200, true, quizData,"quiz fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static editQuiz = async(req, res)=>{
        try
        {
            let quizData = await quizModel.findByIdAndUpdate(req.params.id, req.body, {new:true})
            if(!quizData) throw new Error("quiz not found")
            myHelper.resHandler(res, 200, true, quizData, "quiz updated")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static deleteQuiz = async(req, res)=>{
        try
        {
            let quizData = await quizModel.findByIdAndDelete(req.params.id)
            if(!quizData) throw new Error("quiz not found")
            myHelper.resHandler(res, 200, true, null, "quiz deleted")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }

    //   Quizes Recommendations
    //   @description : Get All Quizes Recommendations 
    //   @method : GET /api/quiz/recommendations/
    //   @access : private/user 
    static recommendedQuizes = async(req,res) => {
        try{
            const quizesData = await quizModel.find({level:req.user.level})
            myHelper.resHandler(res, 200, true, quizesData, "quizes fetched successfully")
        }
        catch(e){
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
}
module.exports = Quiz