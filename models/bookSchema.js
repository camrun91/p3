
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    image: String,
    price: Number
});

module.exports = mongoose.model('books', bookSchema);