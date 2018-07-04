const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {strings} = require('../../private/constants.js');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//Override this function so that sensitive uneccessary/sensitive data is not transferred back
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

UserSchema.methods.removeToken = function (token) {
    var user = this;
    //Let it be known that a return statement must be made here!!
    return user.update({
        $pull: {
            //specify the entity you want to "pull" from
            tokens: {
                //pull from the tokens array any property
                //If token matches something in that array, the entire obejct containing that property will
                //get removed, one less item in the array
                //token: token
                token
            }
        }
    });

};

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if (!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            //use bcrypt.compare
            bcrypt.compare(password, user.password, (err, match) => {
                if (err){
                    reject(err);
                }
                if (match){
                    resolve(user);
                }
                else {
                    reject();
                }
            });
        });
    });
};

UserSchema.statics.findByToken = function (token) {
    let User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, strings.salt);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        //Does the same thing as:
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

//Add Mongoose middleware to make things happen before or after any action, in this case save
UserSchema.pre('save', function (next) {
    var user = this;

    //we must check to see if the password was changed
    if(user.isModified('password')){
        //reference password using user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                //after bcrypt.hash, set it on user.password
                user.password = hash;
                next();
            })
        });
        //next must be called somewhere in the provided callback
        //next();
    } else {
        //If the password isn't modified, skip this middleware
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};