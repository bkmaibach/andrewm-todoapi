const config = require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate.js');


const app = express();

const port = process.env.PORT;

const customMessage = 'Check out the source code at https://github.com/bkmaibach/andrewm-todoapi'

//define 'middleware' that can be 'used by express'
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Todo.find().then(() => {
        res.status(200).send({
            status:'andrewm-todoapi is up and running!',
            port,
            environment: process.env.NODE_ENV,
            customMessage
        });
    }, (err) => {
        console.log('cannot retrieve docs');
        res.status(400).send(err);
    })
    
});

app.post('/todos', authenticate, (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        //console.log("the creation of a new todo was successfull");
        res.status(200).send(doc);
    }, (err) => {
        //console.log("todo creation failed");
        res.status(400).send(err);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.status(200).send({
            todos,
            customMessage
        });
    }, (err) => {
        console.log('cannot retrieve docs');
        res.status(400).send(err);
    })
    
});

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({
            error: 'ID parameter invalid',
        });
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo){
            res.status(404).send({});
        }

        res.status(200).send({
            todo: todo,
            customMessage
        });
        
    }).catch((e) => {
        res.status(400).send();
    });
    
});

app.delete('/todos/:id', authenticate, (req, res) => {
    //Get the ID
    let id = req.params.id;

    //Validate the ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send({
            error: 'ID parameter invalid',
        });
    }

    //Remove todo by ID
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        //console.log(todo);
        //Success? Check that the doc came back, if no doc send 404
        if(!todo){
            res.status(404).send({
                error: 'Could not find this ID'
            });
        } else {
            res.status(200).send({
                todo: todo,
                customMessage
            });
        }
    }).catch((e) => {
        res.status(400).send({error: "An unexpected error was encountered"});
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send({
            error: 'ID parameter invalid',
        });
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            res.status(404).send();
        } else {
            res.send({todo});
        }
    }).catch((error) => {
        res.status(400).send();
    })
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        //console.log("the creation of a new user was successfull");
        res.header('x-auth', token).status(200).send(user);
    }).catch( (err) => {
        //console.log("user creation failed");
        res.status(400).send(err);
    })
});

//To require authentication, all that needs to be done is provide authenticate as an argument here:
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//The authenticate middleware provides us with access to the token (obtained from a header) as well as a 
//particular user object, because it was added as a prooeprty to the req object
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.post('/users/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`)
});

module.exports = {app};