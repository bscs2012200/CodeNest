const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  testId: String,
  questions: [{
    question: String,
    marks: Number // Adding marks field
  }],
  language: String,
  testType: String, // Adding testType field
  email: String,
  duration:Number,
  courseName: String,
  totalMarks: Number,
  section: String
});

const ExamModel = mongoose.model('exam', ExamSchema);
module.exports = ExamModel;
