const mongoose = require('mongoose');
const {strings} = require('../../private/constants.js');
const utils = require('../utils.js')

//configure mongoose to use promises
mongoose.Promise = global.Promise;

const getDBUrl = function(){
    //url will be different depending on weather the port environment variable is defined
    //this is how we know if we are on our local environment or not
       return  utils.isThisProdEnvironment() ?
        `mongodb+srv://bkmaibach:${strings.MONGO_PASS}@cluster0-evabu.mongodb.net/TodoApp`
        : 'mongodb://localhost:27017/TodoApp';
    }

//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect(getDBUrl());

module.exports = {
    mongoose
}

