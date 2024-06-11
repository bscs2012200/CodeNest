"use strict";
exports.__esModule = true;
const fs = require("fs");
const pty = require("node-pty");
const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');
const RegisterModel = require('./models/Register');
const StudentModel = require('./models/Student');
const ExamModel = require('./models/examModel');
const QuestionModel = require('./models/Question');
const createTestattemptModel = require('./models/Testattempt');
const Test = require('./models/Test');
const testattemptSchema = require('./models/Testattempt');
app.use(express.static(path.join(__dirname, "client", "dist")));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
mongoose.connect(`mongodb://127.0.0.1:27017/compiler`);

var terminals = {};
var args = [];


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if (dev) {
    const webpackDev = require("./dev");
    app.use(webpackDev.comp).use(webpackDev.hot);
}

app.get("/msg", (req, res) => {
    res.json({ msg: `Hello World` });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

expressWs.app.ws("/terminals/:pid", function (ws, req) {
    var term = terminals[parseInt(req.params.pid)];

    term.on("data", function (data) {
        ws.send(data);
    });

    ws.on("message", function (msg) {
        term.write(msg);
    });

    ws.on("close", function () {
        term.kill();
        console.log("Closed terminal " + term.pid);
        delete terminals[term.pid];
    });
});

app.get('/codes', async(req, res)=>{
  const codes = await db.Code.find().sort('_id');
  res.status(200).json(codes);
});


app.get('/Python', async(req, res)=>{
  const python = await db.Python.find().sort('_id');
  res.status(200).json(python);
});
app.post("/save", async (req, res) => {
  let result = await db.Code.findByIdAndUpdate({ _id: req.body._id }, { $set: { src: req.body.src } }, { new: true })
  const outputPath = "/home/daniyal/git/C/";
  const { src, extension, filename } = req.body;
  const currentFile = `${outputPath}${filename}${extension}`;
  fs.promises.writeFile(currentFile, src, "utf8");
  res.send("saved");
  
});
app.post("/savep", async (req, res) => {
  let result = await db.Python.findByIdAndUpdate({ _id: req.body._id }, { $set: { src: req.body.src } }, { new: true })
  const outputPath = "/home/daniyal/git/Python/";
  const { src, extension, filename } = req.body;
  const currentFile = `${outputPath}${filename}${extension}`;
  fs.promises.writeFile(currentFile, src, "utf8");
  res.send("saved");
  
});
app.post("/savet", async (req, res) => {

  const outputPath = "/home/daniyal/git/C/";
  const { src, extension, filename } = req.body;
  const currentFile = `${outputPath}${filename}${extension}`;
  console.log("Received payload:", req.body);
  fs.promises.writeFile(currentFile, src, "utf8");
  res.send("saved");
  
});

app.post("/terminals", async function (req, res) {
  
  const { src, extension, filename,language} = req.body;
  
  if (language== "python"){
  args = [ "run", "--rm", "-it", "-v", "/home/daniyal/git/C:/usr/src/myapp", "-w", "/usr/src/myapp", "python:3.9", "bash", "-c",
      `python3.9 ${req.body.filename}.py`];
      
      }
  else if (language == "c"){
          args = [ "run", "--rm", "-it", "-v", "/home/daniyal/git/C:/usr/src/myapp", "-w", "/usr/src/myapp", "gcc:4.9", "bash", "-c",
      `gcc -o ${req.body.filename} ${req.body.filename}.c && ./${req.body.filename}`];

  }
  else if (language == "java"){
    args = [ "run", "--rm", "-it", "-v", "/home/daniyal/git/C:/usr/src/myapp", "-w", "/usr/src/myapp", "openjdk:23-slim", "bash", "-c",
    `javac ${req.body.filename}.java && java ${req.body.filename}`];
}
else if (language == "c++") {
  args = [
    "run", "--rm", "-it", 
    "-v", "/home/daniyal/git/C:/usr/src/myapp", 
    "-w", "/usr/src/myapp", 
    "gcc:4.9", "bash", "-c",
    `g++ -o ${req.body.filename} ${req.body.filename}.cpp && ./${req.body.filename}`
  ];
}



  console.log(`docker ${args.join(' ')}`);
  var cols = parseInt(req.query.cols);
  var rows = parseInt(req.query.rows);

  var term = pty.spawn("docker", args, {
      name: "xterm-color",
      cols: cols || 80,
      rows: rows || 24,
      cwd: process.env.PWD,
      env: process.env
  });
  console.log("Created terminal with PID: " + term.pid);
  terminals[term.pid] = term;

  res.send(term.pid.toString());
  res.end();
});

app.post("/terminals/:pid/size", function (req, res) {
  var pid = parseInt(req.params.pid),
      cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = terminals[pid];

  console.log("Resized terminal " + pid + " to " + cols + " cols and " + rows + " rows.");
  res.status(200).send(pid);
  res.end();
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  RegisterModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.status(400).json({ success: false, message: "Already have an account" });
      } else {
        RegisterModel.create({ name: name, email: email, password: password })
          .then(result => res.json({ success: true, message: "Account created" }))
          .catch(err => res.status(500).json({ success: false, message: "Internal Server Error", error: err }));
      }
    })
    .catch(err => res.status(500).json({ success: false, message: "Internal Server Error", error: err }));
});

  
  app.post('/Stdregister', (req, res) => {
    const {name, regno, password} = req. body;
    StudentModel.findOne({regno: regno})
    .then(user => {
    if(user) {
    res.json ("Already have an account")
    } else {
    StudentModel.create({name: name, regno: regno, password: password})
    .then (result => res.json ("Account created"))
    .catch(err => res.json(err))
    }
    }).catch(err => res.json(err))
    })
  app.post('/login', (req, res) => {
      const { email, password } = req.body;
    
      RegisterModel.findOne({ email: email, password: password })
        .then(user => {
          if (user) {
            res.json("Login successful");
          } else {
            
            res.json("Invalid Credentials");
          }
        })
        .catch(err => res.json(err));
    });
    app.post('/stdlogin', (req, res) => {
      const { regno, password } = req.body;
    
      StudentModel.findOne({ regno: regno, password: password })
        .then(user => {
          if (user) {
            res.json("Login successful");
            
          } else {
            
            res.json("Invalid Credentials");
          }
        })
        .catch(err => res.json(err));
    });
    app.get('/getstudentinfo/:regno', async (req, res) => {
      const student = await StudentModel.findOne({ regno: req.params.regno });
      if (student) {
        res.status(200).json(student.toJSON());
      } else {
        res.status(404).send("Student not found");
      }
    });
    app.get('/geteacherinfo/:email', async (req, res) => {
      const teacher = await RegisterModel.findOne({ email: req.params.email });
      if (teacher) {
        res.status(200).json(teacher.toJSON());
      } else {
        res.status(404).send("Student not found");
      }
    });
  app.post('/reset-password', (req, res) => {
    const { email, password } = req.body;
  
    RegisterModel.findOneAndUpdate({ email: email }, { password: password })
      .then(user => {
        if (user) {
          res.json("Password updated successfully");
        } else {
          res.status(401).json("Authentication failed");
        }
      })
      .catch(err => res.json(err));
  });
  

app.post('/saveTest', async (req, res) => {
    try {
      const { testId, questions, language, testType, duration, email,courseName,totalMarks } = req.body;
  
      // Check if test type, language, and duration are defined
      if (!testType) {
        return res.status(400).json({ success: false, message: 'Please specify Test type' });
      }
      if (!courseName) {
        return res.status(400).json({ success: false, message: 'Please specify Course name' });
      }
      if (!language) {
        return res.status(400).json({ success: false, message: 'Please specify language' });
      }
      if (!duration) {
        return res.status(400).json({ success: false, message: 'Please specify test duration' });
      }
      
      // Check if the questions array is empty
      if (questions.length === 0) {
        return res.status(400).json({ success: false, message: 'Questions array cannot be empty' });
      }
  
      const existingTest = await ExamModel.findOne({ testId });
  
      if (existingTest) {
        return res.status(400).json({ success: false, message: 'Test with the given ID already exists' });
      }
  
      const newQuestions = questions.map(({ question, marks }) => ({ question, marks }));
      const newExam = new ExamModel({ testId, questions: newQuestions, language, testType, duration, email,courseName,totalMarks });
      await newExam.save();
  
      res.json({ success: true, message: 'Test saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error saving test' });
    }
});

app.put('/updateTest/:testId', async (req, res) => {
  const { testId } = req.params;

  try {
    // Find the test by its ID
    const existingTest = await ExamModel.findOne({ testId });

    if (!existingTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Merge existing test with updated fields
    Object.assign(existingTest, req.body);

    const errors = {};

    // Check for empty test type
    if (!req.body.testType || req.body.testType.trim() === '') {
      errors.testType = 'Test type is required';
    }

    // Check for empty language
    if (!req.body.language || req.body.language.trim() === '') {
      errors.language = 'Language is required';
    }

    // Check for empty course name
    if (!req.body.courseName || req.body.courseName.trim() === '') {
      errors.courseName = 'Course name is required';
    }

    // Check for empty duration
    if (!req.body.duration) {
      errors.duration = 'Duration is required';
    }

    // If there are validation errors, return 400 status with error messages
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation errors', errors });
    }

    // Save the updated test
    await existingTest.save();

    res.json({ success: true, message: 'Test updated successfully', updatedTest: existingTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating test' });
  }
});

app.put('/updateQuestion/:testId', async (req, res) => {
  const { testId } = req.params;
  const { questionIndex, updatedQuestion, totalMarks } = req.body;

  // Check if updated question and marks are empty
  if (!updatedQuestion.question || !updatedQuestion.marks) {
    return res.status(400).json({ success: false, message: 'Question and marks cannot be empty' });
  }

  try {
    // Find the test by its ID
    const existingTest = await ExamModel.findOne({ testId });

    if (!existingTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Update the question at the specified index
    existingTest.questions[questionIndex] = updatedQuestion;

    // Update total marks
    existingTest.totalMarks = totalMarks;

    // Save the updated test
    await existingTest.save();

    res.json({ success: true, message: 'Question updated successfully', updatedTest: existingTest });
  } catch (error) {
    console.error(error);

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, errors });
    }

    // For other types of errors, return a general error message
    res.status(500).json({ success: false, message: 'Error updating question' });
  }
});


app.post('/addQuestion/:testId', async (req, res) => {
  const { testId } = req.params;
  const { newQuestion } = req.body;

  // Check if new question and marks are empty
  if (!newQuestion.question || !newQuestion.marks) {
    return res.status(400).json({ success: false, message: 'Question and marks cannot be empty' });
  }

  try {
    // Find the test by its ID
    const existingTest = await ExamModel.findOne({ testId });

    if (!existingTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Add the new question to the test
    existingTest.questions.push(newQuestion);

    // Save the updated test
    await existingTest.save();

    res.json({ success: true, message: 'Question added successfully', updatedTest: existingTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding question' });
  }
});


app.put('/deleteQuestion/:testId', async (req, res) => {
  const { testId } = req.params;
  const { updatedQuestions, totalMarks } = req.body;

  try {
    // Find the test by its ID
    const existingTest = await ExamModel.findOne({ testId });

    if (!existingTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    // Update questions array with the updated questions
    existingTest.questions = updatedQuestions;

    // Update total marks
    existingTest.totalMarks = totalMarks;

    // Save the updated test
    await existingTest.save();

    res.json({ success: true, message: 'Question deleted successfully', updatedTest: existingTest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting question' });
  }
});


app.delete('/deleteTest/:testId', async (req, res) => {
  const { testId } = req.params;

  try {
    // Find and delete the test by its ID
    const deletedTest = await ExamModel.findOneAndDelete({ testId });

    if (!deletedTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    res.json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting test' });
  }
});

  
  app.get('/getTestDetails/:testId', async (req, res) => {
    try {
      const testId = req.params.testId;
      const test = await ExamModel.findOne({ testId });
  
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
  
      res.json(test);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching test details' });
    }
  });
  
  
  
  
  app.get('/getTest', async (req, res) => {
    try {
      const testId = req.query.testId;
      const exam = await ExamModel.findOne({ testId });
      
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Test not found' });
      }
  
      res.json({ success: true, questions: exam.questions, language: exam.language });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching test' });
    }
  });
  
  


app.post('/updateTest', async (req, res) => {
  try {
    const { testId, questions } = req.body;

    
    const existingTest = await ExamModel.findOne({ testId });

    if (!existingTest) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    
    existingTest.questions = questions;

   
    await existingTest.save();

    res.json({ success: true, message: 'Test updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating test' });
  }
});

// app.get('/testIds', async (req, res) => {
//   try {
//     const testIds = await ExamModel.distinct('testId');
//     res.json(testIds);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

app.get('/testIds', async (req, res) => {
  const { email } = req.query; // Get email from query parameters
  try {
    const testIds = await ExamModel.distinct('testId', { email }); // Filter test IDs by email
    res.json(testIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/questions/:testId', async (req, res) => {
  const { testId } = req.params;
  try {
    const exam = await ExamModel.findOne({ testId });
    if (!exam) {
      return res.status(404).json({ error: 'Test ID not found' });
    }
    res.json(exam); // Sending the entire exam object in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});





// POST endpoint to create a new question
app.post('/ques', async (req, res) => {
  const { language, question, email, marks } = req.body;

  if (!language) {
    return res.status(400).json({ success: false, error: 'Please enter language' });
  }
  if (!question) {
    return res.status(400).json({ success: false, error: 'Please Enter Question' });
  }
  if (!marks) {
    return res.status(400).json({ success: false, error: 'Please Enter Marks' });
  }
  if (!email) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const newQuestion = new QuestionModel({ language, question, email, marks });
    await newQuestion.save();
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// GET endpoint to fetch all questions
app.get('/ques', async (req, res) => {
  try {
    const questions = await QuestionModel.find();
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/ques/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const question = await QuestionModel.findById(id);
    
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    res.status(200).json({question});
  } catch (error) {
    console.error('Error retrieving question by ID:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/tests', async (req, res) => {
  try {
    const { testId, teacherEmail, questionIds } = req.body;

    // Check for duplicate test ID
    const existingTest = await Test.findOne({ testId });
    if (existingTest) {
      return res.status(400).json({ success: false, error: 'Test ID already exists' });
    }

    // Validate test ID
    if (!testId.trim()) {
      return res.status(400).json({ success: false, error: 'Test ID cannot be empty' });
    }

    // Validate selected questions
    if (!questionIds || questionIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Please select at least one question' });
    }

    const test = new Test({
      testId,
      teacherEmail,
      questionIds
    });
    await test.save();
    res.status(201).json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/tests', async (req, res) => {
  try {
    const tests = await Test.find(); // Retrieve all tests from the database
    res.status(200).json(tests); // Send the tests as JSON response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/tests/:testId', async (req, res) => {
  const { testId } = req.params;

  try {
    const test = await Test.findOne({ testId });

    if (!test) {
      return res.status(404).json({ success: false, error: 'Test not found' });
    }

    res.status(200).json({test});
  } catch (error) {
    console.error('Error retrieving test by testId:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.put('/ques/:id', async (req, res) => {
  const { id } = req.params;
  const { question, language, marks } = req.body;

  console.log('Received request payload:', req.body); // Log the request body

  // Check if required fields are present in the request body
  if (!question || !language || !marks) {
    return res.status(400).json({ error: 'Missing required fields in the request body' });
  }

  try {
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(id, { question, language, marks }, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.delete('/ques/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await QuestionModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/testattempt', async (req, res) => {
  try {
    const { regno, src, extension, filename, language, questionId,name } = req.body;
    const collectionName = req.body.testId;

    // Create model with custom collection name
    const Testattempt = createTestattemptModel(collectionName);

    // Try to find an existing document with the same regno and questionId
    const existingDocument = await Testattempt.findOne({ regno, questionId });

    if (existingDocument) {
      // Update the existing document with new values
      await Testattempt.updateOne({ regno, questionId }, { src, extension, filename, language });
      res.send('updated');
    } else {
      // Create a new document with provided data
      await Testattempt.create({ regno, src, extension, filename, language, questionId,name });
      res.send('saved');
    }
  } catch (error) {
    console.error('Error saving code:', error);
    res.status(500).send('Error saving code');
  }
});

app.get('/testattempts/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const Testattempt = createTestattemptModel(testId);

    const submissions = await Testattempt.find({});
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('Error fetching submissions');
  }
});


app.get('/getTestResults/:testId', async (req, res) => {
  const testId = req.params.testId;
  try {
    const collectionName = testId.toString();
    const results = await mongoose.connection.db.collection(collectionName).find({}).toArray();
    res.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).send('Error fetching test results');
  }
});





app.listen(3001, () => {
    console.log("Server is Running")
});
