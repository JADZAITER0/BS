const { json } = require('express');
const deviceService = require('../services/device.service');
const userService = require('../services/user.service');
const PACKET_TYPE = require('../constants/packetType.constants').PACKET_TYPE;

const addDevice = async (req, res, next) => {
    if (!req.isAuthenticated()){
        res.status(500).json({ errorMessage: "BLABLABAL" });
        return;
    }
    

    const device_id = req.body.device_id;
    const secret_key = req.body.secret_key;
    

    if (!(await deviceService.areDeviceCredentialsValid(device_id, secret_key))) {
        res.status(404).json({ errorMessage: "Invalid Credentials"});
        return;
    } else if (userService.isDeviceAllreadyLinked(req.user, device_id)){
        console.log("Hi");
        res.status(404).json({ errorMessage: "Device allready linked" });
        return;
    } else {
        await userService.linkNewDevice(req.user, device_id);
        res.status(200).json({ successMessage: "Linked Successfully", device_id: device_id });
        return;
    }
};

const decryptData = async (req, res, next, packetType) => {
    const device = await deviceService.findDeviceById(req.params.id);
    console.log(req.params.id);
    console.log(device);
    if (device){
       
        try {
            
            let jsonData = await deviceService.decryptPacket(device.device_id , req.body.encryptedData);
            

            switch (packetType) {
                case PACKET_TYPE.TEMPRATURE:
                    //logic for saving temprature packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).send("Added Temprature succfully")
                    break;
                case PACKET_TYPE.HUMIDITY:
                    //logic for saving hummidity packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).send("Added Humidity succfully")
                    break;
    
                case PACKET_TYPE.MOISTURE :
                    //logic for saving moisture packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).send("Added Moisture succfully")
                    break;
                
                case PACKET_TYPE.LIGHT:
                    //logic for saving light packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined 
                    res.status(200).send("Added Light data succefully")
                    break;
                default:
    
                    break;
            }
        } catch (error) {
            res.status(400).send('Bad Request');
        } 
        
    }
}

module.exports = {
    addDevice,
    decryptData
};
