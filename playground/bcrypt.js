const bcrypt = require('bcryptjs');

var password = '123abc!!';

//10 is the number of rounds. More rounds means less brute-forceable.
//Andrew knows people who use up to 120 rounds.
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$10$h6Ct/9m8budnIyvWMsExpO0n9wki9nYYV7W1TyZs8k.Pu4aiAL076';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

bcrypt.compare('password?', hashedPassword, (err, res) => {
    console.log(res);
});