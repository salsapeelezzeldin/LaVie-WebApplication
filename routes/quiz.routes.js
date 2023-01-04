const router = require("express").Router()
const Quiz = require('../app/controller/quiz.controller')
const Auth = require("../app/middleware/auth.middleware")

//all Quizes
router.get("/", Auth.authentication, Quiz.allQuizes)
//my Quizes
router.get("/myQuizes", Auth.authentication, Quiz.myQuizes)

//add Quiz
router.post("/addQuiz", Auth.authentication, Quiz.addQuiz)
//single Quiz
router.get("/singleQuiz/:id", Auth.authentication, Quiz.singleQuiz)
//edit Quiz
router.put("/editQuiz/:id", Auth.authentication, Quiz.editQuiz)
//delete Quiz
router.delete("/deleteQuiz/:id", Auth.authentication, Quiz.deleteQuiz)

//Quizes recommendations
router.get("/recommendations", Auth.authentication, Quiz.recommendedQuizes)

module.exports = router