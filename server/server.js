const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const app = express();

//define 'middleware' that can be 'used by express'
app.use(bodyParser.json());

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
    let id = req.params.id

    if(!ObjectID.isValid(id)){
        return res.status(400).send({
            error: 'ID parameter invalid',
        });
    }

    Todo.findById(id).then((todo) => {
        if (todo.length === 0){
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`)
});

module.exports = {app};