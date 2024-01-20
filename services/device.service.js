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
        const existDevice = await Device.findOne({ device_id: device_id});
        return existDevice;
    }catch(err){
        throw(err);
    }    
}

const areDeviceCredentialsValid = async(device_id, secret_key) => {
    try{
        const existDevice = await Device.findOne({ device_id: device_id, secret_key: secret_key});
        return existDevice;
    }catch(err){
        throw(err);
    }    
}

const decryptPacket = async (device_id, encryptedData, packetType) =>  {
    try {
        const device = await findDeviceById(device_id);
        if (!device){
           return 0;
        }else{
            let decryptedData = decryptRequest(device.secret_key, req.body.encryptedData);
            let jsonData;

            try{
                jsonData = JSON.parse(decryptedData);
                const deviceId = jsonData.deviceId;

                if (deviceId === device_id){
                    //packet type logic
                    //time logic to check that packet is new and not forged
                    return decryptedData;
                }else{
                    //replace this with constants name
                    //indicates error type
                    //will be handeled in the controller;
                    return 1;
                }
            }catch(err){
                return 2;
            }
        }
    } catch (err) {
        return 2;
    }
}



// const isSecretKeyValid = (device, secret_key) => {
//     return device.device_id === secret_key;
// }

module.exports = {
    // existDevice,
    areDeviceCredentialsValid,
    // isSecretKeyValid,
}