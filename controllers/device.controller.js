const { json } = require('express');
const deviceService = require('../services/device.service');
const userService = require('../services/user.service');
const { login } = require('./user.controller');
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
    } else if (await userService.isDeviceAllreadyLinked(req.user, device_id)){
        res.status(404).json({ errorMessage: "Device allready linked" });
        return;
    } else {
        const user = await userService.linkNewDevice(req.user, device_id);
        console.log(req.user.username);
        deviceService.addUserToLinkedUsers(device_id, req.user.username);
        res.status(200).json({ successMessage: "Linked Successfully", device_id: device_id });
        return;
    }
};


const removeDevice = async (req, res, next) => {
    if (!req.isAuthenticated()){
        res.status(500).json({ errorMessage: "BLABLABAL" });
        return;
    }
    

    const device_id = req.body.device_id;

    if (await userService.isDeviceAllreadyLinked(req.user, device_id)){
        // console.log(req.user.devices);
        await userService.removeDevice(req.user, device_id);
        deviceService.removeUserFromLinkedUsers(device_id, req.user.username);
        // console.log(req.user.devices);
        res.status(404).json({ successMessage: "Nice" });
        return;
    } else {
        res.status(404).json({ errorMessage: "Bad Request" });
        return;
    }
};


const getDeviceInfo = async (req, res, next) => {
    const device_id = req.params.id;
    console.log(device_id);
    if (req.isAuthenticated()){
        const device = await deviceService.findDeviceById(req.params.id);
        if (!device){
            res.send('<h1>You are not unauthorized to see this device info</h1><p>');
        }else{
            if (req.user.devices.includes(device_id)){
                res.render('../templates/deviceInfo');
            }else{
                res.send('<h1>You dont own this device dummy to see this device info</h1><p>');
            }

            
        }
    }
}

const decryptData = async (req, res, next, packetType) => {
    const device = await deviceService.findDeviceById(req.params.id);
    if (device){
       
        try {
            let jsonData = await deviceService.decryptPacket(device.device_id , req.body.encryptedData);
            console.log(jsonData)

            switch (packetType) {
                case PACKET_TYPE.TEMPRATURE:
                    //logic for saving temprature packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    device.sensor_data.temprature.push(jsonData.temp);
                    res.status(200).send("Added Temprature succfully")
                    break;
                case PACKET_TYPE.HUMIDITY:
                    //logic for saving hummidity packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    device.sensor_data.hummidity.push(jsonData.humi);
                    res.status(200).send("Added Humidity succfully")
                    break;
    
                case PACKET_TYPE.MOISTURE :
                    //logic for saving moisture packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    device.sensor_data.moisture.push(jsonData.mois);
                    res.status(200).send("Added Moisture succfully")
                    break;
                
                case PACKET_TYPE.LIGHT:
                    //logic for saving light packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined 
                    device.sensor_data.light.push(jsonData.ligt);
                    res.status(200).send("Added Light data succefully")
                    break;

                case PACKET_TYPE.CO2:
                    device.sensor_data.carbon_dioxide.push(jsonData.carb);
                    res.status(200).send("Added Carbon data succefully")
                    break;
                default:
    
                    break;
            }
            await device.save();
        } catch (error) {
            res.status(400).send('Bad Request');
        } 
        
    }
}


const getData = async (req, res, next, packetType) => {
    const device = await deviceService.findDeviceById(req.params.id);
    if (device){
            switch (packetType) {
                case PACKET_TYPE.TEMPRATURE:
                    //logic for saving temprature packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).send({data:device.sensor_data.temprature})
                    break;
                case PACKET_TYPE.HUMIDITY:
                    //logic for saving hummidity packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).json({data:device.sensor_data.hummidity})
                    break;
    
                case PACKET_TYPE.MOISTURE :
                    //logic for saving moisture packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    res.status(200).json({data: device.sensor_data.moisture});
                    break;
                
                case PACKET_TYPE.LIGHT:
                    //logic for saving light packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined 
                    res.status(200).json({data: device.sensor_data.light});
                    break;

                case PACKET_TYPE.CO2:
                    res.status(200).json({data: device.sensor_data.carbon_dioxide});
                    break;
                default:
    
                    break;
            }
    }
}




module.exports = {
    addDevice,
    removeDevice,
    decryptData,
    getData,
    getDeviceInfo
};
