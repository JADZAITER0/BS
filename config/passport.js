const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validPassword = require('../lib/passwordUtils').validPassword;
const userService = require('../services/user.service');
const User = require('../models/user');

const customFields = {
    usernameField: 'username', 
    passwordField: 'password'
}
    

const verify = async (username, password, cb) => {
    console.log('hmmm');
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

passport.use(new LocalStrategy(customFields,verify));

passport.serializeUser((userId, done) => {
    done(null, userId);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
    })
});
