const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

//Delete multiple records
// Todo.remove({}).then((res) => {
//     console.log(res);
// });

Todo.findOneAndRemove({text: 'Buy some bananas'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5b3a8e5a901c381790cb17ef').then((todo) => {
    console.log(todo);
});