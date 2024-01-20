const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;
const userService = require('../services/user.service');




/**
 * This method will represent the local startegy used to verify
 * our user
 * @param {name of the user you are verifying} username 
 * @param {*password inputed by the user} password 
 * @param {*returns if the user is authtenicated or not} cb 
 */
const verify = async (username, password, cb) => {

    try{
        const user = await userService.findUserByUsername(username);

        if (!user){
            return cb(null,false,{message: 'Invalid Users'});
        }

        const isValidPassword = validPassword(password, user.hash, user.salt);

        if (isValidPassword){
            return cb(null,user);
        }else {
            return cb(null, false,{message: 'Invalid Credentials'});
        }

    }catch(err){
        cb(err);
    }

};

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
