const config = require('./config/config.js');
config.setEnvironmentVariables();

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

//define 'middleware' that can be 'used by express'
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Todo.find().then(() => {
        res.status(200).send({
            status:'andrewm-todoapi is up and running!',
            port,
            environment: process.env.NODE_ENV,
            currentTodos: 'http://todo.maibach.ca/todos',
            customMessage: 'Check it out, guys! -BKM'
        });
    }, (err) => {
        console.log('cannot retrieve docs');
        res.status(400).send(err);
    })
    
});

app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        //console.log("the creation of a new todo was successfull");
        res.status(200).send(doc);
    }, (err) => {
        //console.log("todo creation failed");
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.status(200).send({
            todos,
            customMessage: 'Check it out, guys! -BKM'
        });
    }, (err) => {
        console.log('cannot retrieve docs');
        res.status(400).send(err);
    })
    
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send({
            error: 'ID parameter invalid',
        });
    }

    Todo.findById(id).then((todo) => {
        if (!todo){
            res.status(404).send({});
        }

        res.status(200).send({
            todo: todo,
            customMessage: 'Check it out, guys! -BKM'
        });
        
    }).catch((e) => {
        res.status(400).send();
    });
    
});

app.delete('/todos/:id', (req, res) => {
    //Get the ID
    let id = req.params.id;

    //Validate the ID
    if(!ObjectID.isValid(id)){
        return res.status(404).send({
            error: 'ID parameter invalid',
        });
    }

    //Remove todo by ID
    Todo.findByIdAndRemove(id).then((todo) => {
        //console.log(todo);
        //Success? Check that the doc came back, if no doc send 404
        if(!todo){
            res.status(404).send({
                error: 'Could not find this ID'
            });
        } else {
            res.status(200).send({
                todo: todo,
                customMessage: 'Check it out, guys! -BKM'
            });
        }
    }).catch((e) => {
        res.status(400).send({error: "An unexpected error was encountered"});
    });
});

app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    User.findByCredentials(req.body.email, req.body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });
        res.send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`)
});

module.exports = {app};