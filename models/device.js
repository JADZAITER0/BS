const mongoose = require('../config/database').mongoose;
const connection = require('../config/database.js').connection;



const DeviceSchema = new mongoose.Schema({
    device_id: String,
    secret_key: String,
    user_linked: [],
    actuator_setting: [],
    sensor_setting:  {temprature:Number,
                        hummidity:Number,
                        moisture:Number,
                        carbon_dioxide:Number,
                        light:Number,
                     },
    sensor_data: {temprature:[],
                 hummidity: [],
                 moisture: [],
                 carbon_dioxide: [],
                 light: [],
                 pressure: [],
                 }
});


const Devices = connection.models.Devices || connection.model('Device',DeviceSchema);
module.exports = Devices;
