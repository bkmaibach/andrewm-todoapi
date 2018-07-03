const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {strings} = require('../../private/constants.js');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
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
        minlength: 8
    },
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
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, strings.salt).toString();

    user.tokens = user.tokens.concat([{access, token}]);
    return user.save().then(() => {
        //You might expect that this should return another promise, since then is going to be
        //chained onto this again. However, this is perfectly legal. The return value is used
        //in the success argument of the next return call.
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};