var mongoose = require("mongoose");

var questionSchema =({
  category:String,
  id:String,
  correctAnswer:String,
  incorrectAnswers:Array,
  question:Object,
  tags:Array,
  regions:Array,
});

var QuestionModel = mongoose.model("question",questionSchema);
module.exports = QuestionModel ;