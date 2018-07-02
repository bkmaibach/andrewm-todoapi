const config = require('./config/config.js');
config.setEnvironmentVariables();

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


const app = express();

const port = process.env.PORT;

//define 'middleware' that can be 'used by express'
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Todo.find().then(() => {
        res.status(200).send({
            message:'andrewm-todoapi is up and running!',
            port,
            environment: process.env.NODE_ENV
        });
    }, (err) => {
        console.log('cannot retrieve docs');
        res.status(400).send(err);
    })
    
});

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        console.log("the creation of a new doc was successfull");
        res.status(200).send(doc);
    }, (err) => {
        console.log("doc creation failed");
        res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        console.log('Retrieving docs');
        res.status(200).send({
            todos,
            customCode: 'Look ma!'
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
            customCode: 'Look ma!'
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
        console.log(todo);
        //Success? Check that the doc came back, if no doc send 404
        if(!todo){
            res.status(404).send({
                error: 'Could not find this ID'
            });
        } else {
            res.status(200).send({
                todo: todo,
                customCode: 'Look ma!'
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
            res.send({todo})
        }
    }).catch((error) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`)
});

module.exports = {app};