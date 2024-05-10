const mongoose = require('../config/database.js').mongoose;
const connection = require('../config/database.js').connection;


const SensorDataSchema = new mongoose.Schema({
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device', // Reference to the Device model
      required: true,
    },
    temperature: [Number],
    humidity: [Number],
    moisture: [Number],
    carbon_dioxide: [Number],
    light: [Number],
});
  
// Step 2: Create the SensorData model
const SensorData = connection.models.SensorData || connection.model('SensorData',SensorDataSchema);
module.exports = SensorData;
