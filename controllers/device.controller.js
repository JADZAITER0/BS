const { json } = require('express');
const deviceService = require('../services/device.service');
const userService = require('../services/user.service');
const { login } = require('./user.controller');
const PACKET_TYPE = require('../constants/packetType.constants').PACKET_TYPE;



const addDevice = async (req, res, next) => {

    const device_id = req.body.device_id;
    const secret_key = req.body.secret_key;


    if (!(await deviceService.areDeviceCredentialsValid(device_id, secret_key))) {
        res.status(404).json({ errorMessage: "Invalid Credentials" });
        return;
    } else if (await userService.isDeviceAllreadyLinked(req.user, device_id)) {
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



    const device_id = req.body.device_id;

    if (await userService.isDeviceAllreadyLinked(req.user, device_id)) {
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


const getDeviceUserCount = async (req, res, next) => {
    const device_id = req.params.id;
    const device = await deviceService.findDeviceById(device_id);
    if (device) {
        console.log(device.user_linked.length);
        res.status(200).json({ userCount: device.user_linked.length });
    } else {
        res.status(404).json({ errorMessage: "Device not found" });
    }
}


const getSensorSetting = async (req, res, next) => {
    const device_id = req.params.id;
    console.log(device_id);
    const device = await deviceService.findDeviceById(device_id);
    if (device) {
        try {
            let jsonData = await deviceService.decryptPacket(device.device_id, req.body.encryptedData);
            console.log(jsonData)
            res.status(200).json({ sensor_setting: device.sensor_setting });
        } catch (error) {
            res.status(400).send('Bad Request');
        }
    } else {
        res.status(404).json({ errorMessage: "Device not found" });
    }
}


const getActuatorSetting = async (req, res, next) => {
    const device_id = req.params.id;
    console.log(device_id);
    const device = await deviceService.findDeviceById(device_id);
    if (device) {
        try {
            let jsonData = await deviceService.decryptPacket(device.device_id, req.body.encryptedData);
            console.log(jsonData);
            res.status(200).json({ actuator_setting: device.actuator_setting });
        } catch (error) {
            res.status(400).send('Bad Request');
        }
    }
    else {
        res.status(404).json({ errorMessage: "Device not found" });
    }
}


const updateActuatorSetting = async (req, res, next) => {
    const deviceId = req.params.id;
    const device = await deviceService.findDeviceById(deviceId);
    console.log(req.body);

    const actuatorSettings = req.body; // Assuming actuator_settings is sent in the request body

    try {
        // Find the device by its device_id
        const device = await deviceService.findDeviceById(deviceId);

        if (!device || !userService.isDeviceAllreadyLinked(req.user, deviceId)) {
            return res.status(404).json({ error: 'Bad request' });
        }

        // Update the actuator_setting field with the new settings
        device.actuator_setting = actuatorSettings;

        // Save the updated device
        await device.save();

    } catch (error) {
        console.error('Error updating actuator settings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Actuator settings updated successfully', device: device });
};




const getDeviceInfo = async (req, res, next) => {
    const device_id = req.params.id;
    console.log(device_id);
    const device = await deviceService.findDeviceById(req.params.id);
    if (!device) {
        res.render('../templates/pageNotFound');
    } else {
        if (req.user.devices.includes(device_id)) {
            res.render('../templates/deviceInfo');
        } else {
            res.render('../templates/notAuthenticated');
        }


    }
}

const decryptData = async (req, res, next, packetType) => {
    const device = await deviceService.findDeviceById(req.params.id);
    if (device) {

        try {
            let jsonData = await deviceService.decryptPacket(device.device_id, req.body.encryptedData);
            console.log(jsonData)

            switch (packetType) {
                case PACKET_TYPE.TEMPRATURE:
                    console.log('Temp');
                    //logic for saving temprature packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    //check if temp is numerical
                    if (isNaN(jsonData.temp)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    device.sensor_data.temprature.push({ value: jsonData.temp, timestamp: new Date() });
                    res.status(200).send("Added Temprature succfully")
                    break;
                case PACKET_TYPE.HUMIDITY:
                    //logic for saving hummidity packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifine
                    if (isNaN(jsonData.humi)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    device.sensor_data.hummidity.push({ value: jsonData.humi, timestamp: new Date() });
                    res.status(200).send("Added Humidity succfully")
                    break;

                case PACKET_TYPE.MOISTURE:
                    //logic for saving moisture packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined
                    if (isNaN(jsonData.mois)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    device.sensor_data.moisture.push({ value: jsonData.mois, timestamp: new Date() });
                    res.status(200).send("Added Moisture succfully")
                    break;

                case PACKET_TYPE.LIGHT:
                    //logic for saving light packet to the databaase along with checking if they are valid
                    // validity include time, value if null or undifined 
                    if (isNaN(jsonData.ligt)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    console.log(jsonData.ligt);
                    device.sensor_data.light.push({ value: jsonData.ligt, timestamp: new Date() });
                    res.status(200).send("Added Light data succefully")
                    break;

                case PACKET_TYPE.CO2:
                    if (isNaN(jsonData.carb)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    device.sensor_data.carbon_dioxide.push({ value: jsonData.carb, timestamp: new Date() });
                    res.status(200).send("Added Carbon data succefully")
                    break;
                case PACKET_TYPE.PRESSURE:
                    if (isNaN(jsonData.pres)) {
                        res.status(400).send('Data is not valid');
                        return;
                    }
                    device.sensor_data.pressure.push({ value: jsonData.pres, timestamp: new Date() });
                    res.status(200).send("Added Pressure data succefully")
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
    if (device) {
        switch (packetType) {
            case PACKET_TYPE.TEMPRATURE:
                //logic for saving temprature packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                console.log(device.sensor_data.temprature[device.sensor_data.temprature.length - 1]);
                res.status(200).send({ data: device.sensor_data.temprature })
                break;
            case PACKET_TYPE.HUMIDITY:
                //logic for saving hummidity packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                console.log(device.sensor_data.hummidity[device.sensor_data.hummidity.length - 1]);
                res.status(200).json({ data: device.sensor_data.hummidity })
                break;

            case PACKET_TYPE.MOISTURE:
                //logic for saving moisture packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                res.status(200).json({ data: device.sensor_data.moisture });
                break;

            case PACKET_TYPE.LIGHT:
                //logic for saving light packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined 
                res.status(200).json({ data: device.sensor_data.light });
                break;

            case PACKET_TYPE.CO2:
                res.status(200).json({ data: device.sensor_data.carbon_dioxide });
                break;

            case PACKET_TYPE.PRESSURE:
                res.status(200).json({ data: device.sensor_data.pressure });
                break;

            default:
                break;
        }
    }
}

const updateSensorSetting = async (req, res, next) => {
    const deviceToken = req.params.id;
    console.log(deviceToken);
    const setting = req.body; // Assuming the settings are directly in the request body
    const device = await deviceService.findDeviceById(deviceToken);
    
    if (!device) return res.status(404).json({ error: 'Device not found.' });

    console.log("Setting object:", setting);

    const roundedSamplingTimes = {};
    for (const key in setting) {
        const parsedKey = parseInt(setting[key]);
        if (!isNaN(parsedKey)) {
            roundedSamplingTimes[key] = setting[key];
            console.log("Adding to roundedSamplingTimes:", key, roundedSamplingTimes[key]);
        }
    }

    // Update the sensor settings with the rounded sampling times
    device.sensor_setting = {
        temprature: roundedSamplingTimes.temp_sampling_hours * 120 + roundedSamplingTimes.temp_sampling_minutes * 2 + roundedSamplingTimes.temp_sampling_seconds,
        hummidity: roundedSamplingTimes.humidity_sampling_hours * 120 + roundedSamplingTimes.humidity_sampling_minutes * 2 + roundedSamplingTimes.humidity_sampling_seconds,
        moisture: roundedSamplingTimes.moisture_sampling_hours * 120 + roundedSamplingTimes.moisture_sampling_minutes * 2 + roundedSamplingTimes.moisture_sampling_seconds,
        carbon_dioxide: roundedSamplingTimes.carbon_sampling_hours * 120 + roundedSamplingTimes.carbon_sampling_minutes * 2 + roundedSamplingTimes.carbon_sampling_seconds,
        light: roundedSamplingTimes.light_sampling_hours * 120 + roundedSamplingTimes.light_sampling_minutes * 2 + roundedSamplingTimes.light_sampling_seconds,
        pressure: roundedSamplingTimes.pressure_sampling_hours * 120 + roundedSamplingTimes.pressure_sampling_minutes * 2 + roundedSamplingTimes.pressure_sampling_seconds
    };

    device.save();

    // Log rounded sampling times
   

    // Check if the device with the given token is connected
    // Assuming everything went well, send success response
    res.status(200).json({ message: 'Setting change request processed successfully.' });
};

module.exports = { updateSensorSetting };


const getPrediction = async (req, res, next, packetType) => {
    const device = await deviceService.findDeviceById(req.params.id);
    if (device) {
        switch (packetType) {
            case PACKET_TYPE.TOMATO:
                //logic for saving temprature packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                console.log(device.sensor_data.temprature[device.sensor_data.temprature.length - 1]);
                res.status(200).send({ data: device.sensor_data.temprature })
                break;
            case PACKET_TYPE.STRAWBERRY:
                //logic for saving hummidity packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                console.log(device.sensor_data.hummidity[device.sensor_data.hummidity.length - 1]);
                res.status(200).json({ data: device.sensor_data.hummidity })
                break;

            case PACKET_TYPE.BELLPEPPER:
                //logic for saving moisture packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined
                res.status(200).json({ data: device.sensor_data.moisture });
                break;

            case PACKET_TYPE.CUCUMBER:
                //logic for saving light packet to the databaase along with checking if they are valid
                // validity include time, value if null or undifined 
                res.status(200).json({ data: device.sensor_data.light });
                break;

            case PACKET_TYPE.EGGPLANT:
                res.status(200).json({ data: device.sensor_data.carbon_dioxide });
                break;

            case PACKET_TYPE.POTATO:
                res.status(200).json({ data: device.sensor_data.pressure });
                break;

            default:
                break;
        }
    }
};


module.exports = {
    addDevice,
    removeDevice,
    decryptData,
    getData,
    getDeviceInfo,
    getDeviceUserCount,
    updateSensorSetting,
    getSensorSetting,
    getActuatorSetting,
    updateActuatorSetting,
};
