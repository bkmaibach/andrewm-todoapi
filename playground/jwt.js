const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data, 'saltysecret');
console.log(token);

let decoded = jwt.verify(token, 'saltysecret');
console.log('decoded: ', decoded);

let decodedAltered = jwt.verify(token + '1', 'saltysecret');
console.log('decoded: ', decodedAltered);

let decodedFraud = jwt.verify(token, 'saltyfraud!');
console.log('decoded: ', decodedFraud);