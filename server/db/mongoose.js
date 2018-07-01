const mongoose = require('mongoose');
const {strings} = require('../../private/constants.js');

//configure mongoose to use promises
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/TodoApp');
var uri = `mongodb+srv://bkmaibach:${strings.MONGO_PASS}@cluster0-evabu.mongodb.net/TodoApp`;
mongoose.connect(uri);

module.exports = {
    mongoose
}