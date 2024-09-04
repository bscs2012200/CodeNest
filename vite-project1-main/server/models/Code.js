const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');

const codeSchema = new Schema({
    title: String,
    filename: String,
    extension: String,
    language: String,
    src: String,
})

exports.Code = model('Code', codeSchema);
