const {MongoClient, ObjectId} = require('mongodb');

var obj = new ObjectId();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    
if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    
    console.log('Connected to MongoDB server...');
    const db = client.db('TodoApp')

    db.collection('Todos').findOneAndUpdate(
    
    {
        //The first argument is an object where property names are field names
        //and property values are field values. This is how we "find one".
        _id: new ObjectId("5b2b3ff15bee5f97470e89ea")
    },
    
    {
        //The second argument has property names which are these $ sign operator codes,
        //and these properties values are objects which correspond to changes made to fields
        //of the found document
        $set: {
            completed: true
        }
    },
    //The third argument is options, for example, here we don't want the original doument
    //to be returned 
    {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectId("5b2c11e15bee5f97470e9ef2") },

        {
            $set:{ name: 'Maibes Mahman' },
            $inc:{ age: 1 }
        },

        {
            returnOriginal: false
        }

    ).then((result) => {
        console.log(result);
    });

    client.close();
});