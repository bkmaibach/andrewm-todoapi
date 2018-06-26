const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

let id = '5b3248f2b062ea260b32cb3b';
let missingId = '6b3248f2b062ea260b32cb3b';
let invalidId = '5b3248f2b062ea260b32cb3b11';

if(!ObjectID.isValid(invalidId)){
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos:', todos);
});

Todo.findOne({
    completed: false
}).then((todo) => {
    console.log('Todo:', todo);
});

Todo.findById(id).then((todo) => {
    console.log('Todo by ID:' , todo);
});

Todo.findById(missingId).then((todo) => {
    if(!todo){
        return console.log('Id not found')
    }
    console.log('Todo by ID:' , todo);
});

// Todo.findById(invalidId).then((todo) => {
//     if(!todo){
//         return console.log('Id not found')
//     }
//     console.log('Todo by ID:' , todo);
// }).catch((e) => console.log(e));


let userId = '5b2c264794c16206821a3d52';

User.findById(userId).then((user) => {
    if(!user){
        return console.log('User not found')
    }
    console.log('User by ID:' , user);
}, (e) => {
    console.log(e);
}).catch((e) => console.log(e));