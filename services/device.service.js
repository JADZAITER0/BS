const { decryptData } = require('../controllers/device.controller');
const Device = require('../models/device');
const genPassword= require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;
const decryptRequest = require('../lib/passwordUtils').decryptRequest;


// const existDevice = async(device_id) => {
//     try{
//         const existDevice = await Device.findOne({ device_id: device_id });
//         return existDevice !== null;
//     }catch(err){
//         throw(err);
//     }
// }


const findDeviceById = async (device_id) => {
    try{
        const existDevice = await Device.findOne({ device_id: device_id}).exec();
        return existDevice;
    }catch(err){
        throw(err);
    }    
}


const addUserToLinkedUsers = async (device_id, user) => {
    //when we call this method we are sure the device is found
    const device = await findDeviceById(device_id);
    device.user_linked.push(user);
    await device.save();
    return device;
}


const removeUserFromLinkedUsers = async (device_id, user) => {
    try{
        const updatedDevice = await Device.findOneAndUpdate(
            { device_id: device_id },
            { $pull: { user_linked: user } },
            { new: true }
        );
        return updatedDevice;
    }catch(err){
        throw(err);
    }
}

const areDeviceCredentialsValid = async(device_id, secret_key) => {
    try{
        const existDevice = await Device.findOne({ device_id: device_id, secret_key: secret_key}).exec();
        return existDevice;
    }catch(err){
        throw(err);
    }    
}

const decryptPacket = async (device_id, encryptedData) =>  {
    try {
        const device = await findDeviceById(device_id);
        
        if (!device){
           return 0;
        }else{
            let decryptedData = decryptRequest(device.secret_key, encryptedData);
            let jsonData;
            try{
                jsonData = JSON.parse(decryptedData);
                const deviceId = jsonData.deviceId;
                console.log(deviceId === device_id);

                if (deviceId === device_id){
                    //packet type logic
                    //time logic to check that packet is new and not forged
                    console.log(jsonData);
                    return jsonData;
                }else{
                    //replace this with constants name
                    //indicates error type
                    //will be handeled in the controller;
                    throw new Error('forged packet');
                }
            }catch(err){
                throw err;
            }
        }
    } catch (err) {
       throw err;
    }
}



// const isSecretKeyValid = (device, secret_key) => {
//     return device.device_id === secret_key;
// }

module.exports = {
    // existDevice,
    areDeviceCredentialsValid,
    decryptPacket,
    findDeviceById,
    addUserToLinkedUsers,
    removeUserFromLinkedUsers
}
