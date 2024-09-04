const mongoose = require('mongoose');

const testattemptSchema = new mongoose.Schema({
  regno: String,
  questionId: String,
  src: String,
  extension: String,
  filename: String,
  language: String,
  name: String,
  date: String

});

// Define a function to create model with custom collection name
const createTestattemptModel = (collectionName) => {
  return mongoose.model('Testattempt', testattemptSchema, collectionName);
};

module.exports = createTestattemptModel;
