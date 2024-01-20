const passport = require('passport');
const userService = require('../services/user.service');
const deviceService = require('../services/device.service');
const userValidator = require('../validators/user.validator');
const ERROR = userValidator.ERROR;
const VALID = userValidator.VALID;

const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const usernameCheck = userValidator.isUsernameValid(username);
    const passwordCheck = userValidator.isPasswordValid(password);

    if (usernameCheck !== VALID){
        //handeled using ajax
        res.status(404).json({usernameError: usernameCheck});       
    }

    if (passwordCheck !== VALID){
        //handeled using ajax   
        res.status(404).json({passwordError: passwordCheck});
    }

    if (passwordCheck !== VALID || usernameCheck !== VALID){
        return;
    }

    try {

        if (await userService.existUser(username)){
            res.status(404).json({errorMessage: "User allready exist"});
            return;
    
        }else{
            userService.createUser(username,password);
            res.status(200).json({successMessage: "User created succesfully"});
            return;
        }

    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
    
       
}


const validUser = async (req, res, next) =>{
    try{
        if (await !userService.existUser(username)){
            res.status(404).json({errorMessage: "Invalid Username"});
        }
        next();
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
};


const login = (req, res) => {
    passport.authenticate('local',{
        failureRedirect: '/login' ,
        failureFlash: true,
        successRedirect: '/dashboard'
    });
};

const addDevice = async (req, res) => {
  
    const device_id = req.body.device_id;
    const secret_key = req.body.secret_key;

    if (await !deviceService.areDeviceCredentialsValid(device_id,secret_key)){
        res.status(404).json({errorMessage: "Invalid Credentials"});
        return;
    }else{
        await userService.linkNewDevice(req.user, device_id);
        res.status(200).json({successMessage: "Linked Succesfully", device_id: device_id});
        return;
        //handeled using ajax
    }

}