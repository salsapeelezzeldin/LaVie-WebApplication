const router = require("express").Router()
const Quiz = require('../app/controller/quiz.controller')
const Auth = require("../app/middleware/auth.middleware")

//all Quizes
router.get("/", Auth.authentication, Auth.restrictTo("user", "admin"), Quiz.allQuizes)
//my Quizes
router.get("/myQuizes", Auth.authentication, Auth.restrictTo("admin"), Quiz.myQuizes)

//add Quiz
router.post("/addQuiz", Auth.authentication, Auth.restrictTo("admin"), Quiz.addQuiz)
//single Quiz
router.get("/singleQuiz/:id", Auth.authentication, Auth.restrictTo("admin"), Quiz.singleQuiz)
//edit Quiz
router.put("/editQuiz/:id", Auth.authentication, Auth.restrictTo("admin"), Quiz.editQuiz)
//delete Quiz
router.delete("/deleteQuiz/:id", Auth.authentication, Auth.restrictTo("admin"), Quiz.deleteQuiz)

//Quizes recommendations
router.get("/recommendations", Auth.authentication, Auth.restrictTo("user"), Quiz.recommendedQuizes)

module.exports = router