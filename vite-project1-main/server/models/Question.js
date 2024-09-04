const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    language: String,
    question: String,
    email: String,
    marks: Number
})

const QuestionModel = mongoose.model("Questions",questionSchema);
module.exports = QuestionModel;