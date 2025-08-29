var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken')
var cors = require("cors");
var app = express();
var QuestionModel = require("./models/questions.model");
const UserModel = require("./models/user.model");
app.set("view engine","pug")
app.use(bodyParser.json());
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));


var mongourl = "mongodb+srv://pravallika:pravallika7@cluster0.x6xvdi7.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongourl)
        .then(() => console.log("Connected"))
        .catch(() => console.log("Not Connected"));

app.get("/",async function(req,res) {
    res.sendFile(__dirname + "/public/home.html");
}); 

app.get("/getAllQuestions", function (req,res){
  QuestionModel.find({}).then((data) => res.send(data));
});
function checkAuth(req,res,next){
  try{
 var user = jwt.verify(req.headers.token,"Nothing")
  console.log("user:" ,user);
  next();
} catch(err){
     res.send({msg:"sessionTimeout"})
    }
}

app.get("/getAllQuestions/:category", checkAuth,(req,res) =>{
  const categories = req.params.category;
//    console.log(category);
   QuestionModel.find({category:categories},{ _id: 0, tags:0, regions:0, isNiche:0, difficulty:0, type:0 }).then((data) => {
    var d=JSON.parse(JSON.stringify(data));
    var questions = d.map((question) => {
        question.options = [...question.incorrectAnswers];
        const randomNumber = Math.floor(Math.random() * 4);
        question.options.splice(randomNumber, 0,question.correctAnswer);
        // delete question.correctAnswer;
        // delete question.incorrectAnswers;
        let { correctAnswer , incorrectAnswers, ...ques } = question;
        // return question
        return ques;
    });
//    res.render("questions", { questions: questions });
res.json(questions);
  });   
});

app.post("/submitQuiz",async (req,res) => {
    console.log("submitQuiz::",req.body.category);
    var data = await QuestionModel.find({category:req.body.category})
    // console.log(data)
    var count = 0;
    req.body.questions.forEach((q) => {
        if (q.selectedOption) {
        //   console.log(q.id)
          var d = data.find((qsn) => {
            if(qsn.id === q.id){
              if (qsn.correctAnswer === q.selectedOption){
              count++;
             }
             q.correctAnswer = qsn.correctAnswer
            } 
          });
        //   console.log(d[0].correctAnswer);
        //   console.log(q.selectedOption);
        //   console.log(d[0].correctAnswer == q.selectedOption)
        //   if (d[0].correctAnswer == q.selectedOption) {
        //     count++;
        //   }
        //   console.log(d)
        }
    });
    console.log(req.body)
    console.log(count)
    res.json({ score:count,total:req.body.questions.length, updatedQuestions:req.body });
});

app.post("/registerUser",async (req,res)=>{
    console.log(req.body);
    var newUser = UserModel(req.body);
    newUser
    .save()
    .then(()=>{
        res.send({msg:"Success"})
    })
    .catch((err)=>{
        res.send({msg: JSON.stringify(err)})
    });
});

app.post("/login", async function (req,res){
   try{
    var data = await UserModel.find(req.body);
   console.log("data",data);
   if(data.length!=0){
    const token =jwt.sign({user:req.body},"Nothing")
      res.send({msg:"Success",token,userDetails:{username:req.body.username}})
   }
  else{
    res.send({msg:"Failed"})
  }
} catch(e){

  res.send({msg:"Server Error"})
}
})

// app.post("/evaluate/:category", async function(req, res) {
//     const category = req.params.category;
//     const userAnswers = req.body;
//     const questions = await QuestionModel.find({ category });
//     let correctAns = 0;
//     let totalQuestions = questions.length;
//     questions.forEach((q, index) => {
//         const userAnswer = userAnswers[`q${index}`];
//         if (userAnswer === q.correctAnswer) {
//             correctAns++;
//         }
//     });
//     res.render("score", { correctAns, totalQuestions });
// });


app.listen(3800,()=>{
    console.log("Server running on 3800")
});