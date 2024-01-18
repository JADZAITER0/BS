const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;


const field = {
    usernameField: 'uname',
    passwordField: 'pw'
}


/**
 * This method will represent the local startegy used to verify
 * our user
 * @param {name of the user you are verifying} username 
 * @param {*password inputed by the user} password 
 * @param {*returns if the user is authtenicated or not} cb 
 */
const verify = (username, password, cb) => {
    User.findOne({username:  username})
        .then((user) => {
            if (!user) { 
                return cb(null,false,{message: 'Invalid Users'});
            }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid){
                return cb(null,user);
            }else {
                return cb(null, false,{message: 'Invalid Credentials'});
            }
        })
        .catch((err) => {
            cb(err);
        });
}

passport.use(new LocalStrategy(verify));

passport.serializeUser((userId, done) => {
    done(null, userId);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
});
