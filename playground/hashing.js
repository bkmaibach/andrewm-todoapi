const {SHA256} = require('crypto-js');

let message = 'I am user number 3.';
let hash = SHA256(message);
console.log(`message: ${message}`);
console.log(`hash: ${hash}`);

let data = {
    id: 4
}

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'saltysecret').toString()
}

//I am the MOTM, I am changing the data and rehashing it!
token.data.id = 5;
//If they didn't use a salty secret, then maybe I can get away with changing the ID
token.hash = SHA256(JSON.stringify(data)).toString();


var resultHash = SHA256(JSON.stringify(token.data) + 'saltysecret').toString();
if(resultHash === token.hash){
    console.log('Data was not changed')
} else {
    console.log('Data was changed, do not trust!');
}