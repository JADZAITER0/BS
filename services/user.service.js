const User = require('../models/user');
const genPassword= require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;

const createUser = async(username, password) => {

    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.genHash;

    const newUser= new User({
        username: username,
        hash: hash,
        salt: salt,
        devices: []
    });

    try{
        await newUser.save();
        return newUser;
    }catch(err){
        throw(err);
    }

};


const existUser = async(username) => {
    try {
        const existUser = await User.findOne({ username: username }).exec();
        return existUser !== null;
    }catch(err){
        throw(err);
    }
};


const findUserByUsername = async(username1) =>{
    try {
        const existUser = await User.findOne({ username: username1 }).exec();
        console.log(existUser);
        return existUser;
    }catch(err){
        throw(err);
    }
}

const linkNewDevice = async(user,device_id) => {
    try{
        user.devices.push(device_id);
        await user.save();
        return user;
    }catch(err){
        throw(err);
    }
};

const removeDevice = async(user,device_id) => {
    try{
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $pull: { devices: device_id } },
            { new: true }
        );
        return user;
    }catch(err){
        throw(err);
    }
};


const isDeviceAllreadyLinked = async(user, device_id) => {
    try {
        return (user.devices.indexOf(device_id) != -1);
    } catch (error) {
        console.log(error);
        return false;
    }
}








module.exports = {
    createUser,
    existUser,
    linkNewDevice,
    removeDevice,
    isDeviceAllreadyLinked,
    findUserByUsername,
}



