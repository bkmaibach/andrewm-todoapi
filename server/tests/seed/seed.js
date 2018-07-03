const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const {strings} = require('../../../private/constants.js')

const userZeroId = new ObjectID();
const userOneId = new ObjectID();

const testUsers = [{
    _id: userZeroId,
    email: 'test@example.com',
    password: 'User0TestPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userZeroId, access: 'auth'}, strings.salt).toString()
    }]
}, {
    _id: userOneId,
    email: 'trial@sample.com',
    password: 'User1TestPass',
}];

const testTodos = [{
    _id: new ObjectID(),
    text: 'First todo'
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(testTodos);
    }).then(() => done());
};

//insertmany() can't be run here because that would bypass our password hashing middewlare
const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user0Promise = new User(testUsers[0]).save();
        var user1Promise = new User(testUsers[1]).save();
        //Promise.all take an array of promises and lets us respond to all of them at once
        return Promise.all([user0Promise, user1Promise]);
    }).then(() => done());
};

module.exports ={
    testTodos,
    testUsers,
    populateTodos,
    populateUsers
}