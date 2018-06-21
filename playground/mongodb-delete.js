const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    
if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    
    console.log('Connected to MongoDB server...');
    const db = client.db('TodoApp');


    db.collection('Todos').deleteOne({text: 'Buy some bananas'}).then( (result) => {
        console.log(result);
    }, (err) => {
        console.log(err);
    });

    db.collection('Users').deleteMany({name: 'Butt Donnicker'});
    var _id = 
    db.collection('Users').findOneAndDelete({_id: new ObjectId('5b2b3fce93076e0fce9dffba')})
    .then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    });

    client.close();
});