const mongoose = require('mongoose');

//configure mongoose to use promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}

