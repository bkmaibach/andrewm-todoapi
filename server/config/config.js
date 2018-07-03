const {strings} = require('../../private/constants.js');

const setEnvironmentVariables = function () {
    if(process.env.NODE_ENV == undefined){
        process.env.NODE_ENV = 'development';
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    } else if (process.env.NODE_ENV === 'test'){
        process.env.PORT = 3000;
        process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    } else if (process.env.NODE_ENV === 'production'){
        process.env.MONGODB_URI = `mongodb+srv://bkmaibach:${strings.MONGO_PASS}@cluster0-evabu.mongodb.net/TodoApp`;
    }
    console.log(`***** ENVIRONMENT VARIABLES SET FOR: `, process.env.NODE_ENV)
}

module.exports = {
    setEnvironmentVariables
}