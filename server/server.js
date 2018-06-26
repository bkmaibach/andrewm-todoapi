var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up, listening on port ${port}`)
});

module.exports = {app};