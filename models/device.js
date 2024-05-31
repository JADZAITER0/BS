const mongoose = require('../config/database').mongoose;
const connection = require('../config/database.js').connection;

const SensorDataSchema = new mongoose.Schema({
    value: Number,
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

const DeviceSchema = new mongoose.Schema({
    device_id: String,
    secret_key: String,
    user_linked: [],
    actuator_setting: [],
    sensor_setting:  {  temprature:Number,
                        hummidity:Number,
                        moisture:Number,
                        carbon_dioxide:Number,
                        light:Number,
                        pressure:Number,
                     },
    sensor_data: {temprature:[SensorDataSchema],
                 hummidity: [SensorDataSchema],
                 moisture: [SensorDataSchema],
                 carbon_dioxide: [SensorDataSchema],
                 light: [SensorDataSchema],
                 pressure: [SensorDataSchema],
                 }
});




const Devices = connection.models.Devices || connection.model('Device',DeviceSchema);
module.exports = Devices;
