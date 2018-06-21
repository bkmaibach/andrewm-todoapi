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
    const db = client.db('TodoApp');
    var objId = new ObjectId('5b2b3e34c5001a0e5606ad00');

    // db.collection('Todos').find().count().then( (count) => {
    //     console.log('Todos count: ');
    //     console.log(JSON.stringify(count, undefined, 2))
    // }, (err) => {
    //     console.log('unable to load todos from database: ', err);
    // });

    db.collection('Users').find({name: 'Dink Donnicker'}).toArray().then( (docs) => {
        console.log(docs);
    }, (err) => {
        console.log(err);
    });

    client.close();
});