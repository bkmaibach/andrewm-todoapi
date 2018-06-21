//const MongoClient = require('mongodb').MongoClient;
//Object destructureing: pull out a single property of an object using curly braces in the variable name
//require('mongodb') has a .MongoClient and ObjectId properties, and now they're our variables.
const {MongoClient, ObjectId} = require('mongodb');

var obj = new ObjectId();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    
if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    
    console.log('Connected to MongoDB server...');
    const db = client.db('TodoApp')

    db.collection('Todos').insertOne({
        text: 'Buy some bananas',
        completed: false
    }, (err, result) => {
        if (err){
            return console.log('Something went wrong inserting todo');
        }
        console.log('Successfully inserted todo:');
        console.log(JSON.stringify(result.ops, undefined, 2))
    });

    // Insert new doc into the users collection, give it a name, age, and location string.
    // Insert it passing in the new collection name and handle any errors.
    
    db.collection('Users').insertOne({
        name: 'Butt Donnicker',
        Age: 22,
        Location: 'Frogballs, Illinois'
    }, (err, result) => {
        if (err){
            return console.log('Something went wrong inserting todo: ', err);
        }
        console.log('Successfully inserted todo:');
        console.log(result.ops[0]._id.getTimestamp());
        //console.log(JSON.stringify(result.ops, undefined, 2))
    });

    client.close();
});