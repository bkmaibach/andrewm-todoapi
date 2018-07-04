const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userZeroId = new ObjectID();
const userOneId = new ObjectID();

const testUsers = [{
    _id: userZeroId,
    email: 'user@zero.com',
    password: 'User0TestPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userZeroId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userOneId,
    email: 'user@one.com',
    password: 'User1TestPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const testTodos = [{
    _id: new ObjectID(),
    text: 'First todo',
    _creator: userZeroId,
    //note that any default values cant be assumed for testTodos
    //because this array has not touched been touched by mongoose yet
    //when it is being access directly from within the test suit
    completed: false,
    completedAt: null
}, {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333,
    _creator: userOneId
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