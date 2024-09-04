const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');

const pythonSchema = new Schema({
    title: String,
    filename: String,
    extension: String,
    language: String,
    src: String,
})

exports.Python = model('Python', pythonSchema);
