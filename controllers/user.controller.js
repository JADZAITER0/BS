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
        console.log("hi");
        res.status(404).json({passwordError: passwordCheck, usernameError: usernameCheck});
        return;
    }

    try {

        if (await userService.existUser(username)){
            console.log("hi1");
            res.status(404).json({usernameError: [ERROR.USER_ALLREADY_EXIST]});
            return;
    
        }else{
            console.log("hi2");
            userService.createUser(username,password);
            res.status(200).json({success:1});
            return;
        }

    } catch (err) {
        console.log("hi3");
        console.error(err);
        res.status(500).json({message: "Internal server error"});
    }
    
       
}

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        next();
    }else{
        //render the not authenticated page
        res.render('../templates/notAuthenticated');
        
    }
};

const userConnectedToDevice = async (req, res, next) => {
    if (userService.isDeviceAllreadyLinked(req.params.id, req.user.username)){
        next();
    }else{
        res.status(404).json({errorMessage: "Device not linked to user"});
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
    validUser,
    isAuthenticated,
    userConnectedToDevice
}