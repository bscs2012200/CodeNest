const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  questionIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Question',
    required: true
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
