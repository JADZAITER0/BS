const mongoose = require('../config/database').mongoose;
const connection = require('../config/database.js').connection;

const DeviceSchema = new mongoose.Schema({
    device_id: String,
    secret_key: String,
    user_linked: [],
    actuator_setting: []
});

const Devices = connection.model('Device',DeviceSchema);

module.exports = Devices;
