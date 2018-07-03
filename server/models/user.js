const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 8,
        tokens: [{
            access: {
                type: String,
                requried: true
                },
            token: {
                type: String,
                requried: true
                },
        }],

    }
});

module.exports = {User};