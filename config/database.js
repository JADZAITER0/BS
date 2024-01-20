const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.MONGODB_URI;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    devices:[]
});


// Common settings schema
const actuator_setting = {
    minTemp: Number,
    maxTemp: Number,
    minMoisture: Number,
    maxMoisture: Number,
    minLight: Number,
    maxLight: Number,
    minHumidity: Number,
    maxHumidity: Number
};

const ActuatorPresetSchema = new mongoose.Schema({
    plantName: String,
    waterSprinkler: actuator_setting,
    curtains: actuator_setting,
    fan: actuator_setting,
    heater: actuator_setting
});

const DeviceSchema = new mongoose.Schema({
    device_id: String,
    secret_key: String,
    actuator_setting: []
});




// const User = connection.model('User', UserSchema);
// const Devices = connection.model('Device',DeviceSchema);
// const ActuatorPreset = connection.model('ActuatorPreset',ActuatorPresetSchema); 

// Expose the connection
module.exports = connection;
module.exports = mongoose;