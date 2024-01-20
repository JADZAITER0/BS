const passport = require('passport');
const userService = require('../services/user.service');
const userValidator = require('../validators/user.validator');
const ERROR = userValidator.ERROR;
const VALID = userValidator.VALID;

const register = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameCheck = userValidator.isUsernameValid(username);
    const passwordCheck = userValidator.isPasswordValid(password);

    if (passwordCheck !== VALID || usernameCheck !== VALID){
        console.log(VALID);
        res.status(404).json({passwordError: passwordCheck, usernameError: usernameCheck});
        return;
    }

    try {

        if (await userService.existUser(username)){
            res.status(404).json({errorMessage: "User allready exist"});
            return;
    
        }else{
            userService.createUser(username,password);
            res.status(200).redirect('/login');
            return;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
    
       
}


const validUser = async (req, res, next) =>{
    try{
        if (await !userService.existUser(req.body.username)){
            res.status(404).json({errorMessage: "Invalid Username"});
        }
        next();
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};


const login = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
        successRedirect: '/dashboard'
    })(req, res, next);
};


module.exports = {
    register,
    login,
    validUser
}