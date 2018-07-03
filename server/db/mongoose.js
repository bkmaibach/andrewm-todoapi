const mongoose = require('mongoose');

//configure mongoose to use promises
mongoose.Promise = global.Promise;

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}

