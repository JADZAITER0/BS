const mongoose = require('../config/database.js').mongoose;
const connection = require('../config/database.js').connection;

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    devices:[]
});


// const User = connection.model('User', UserSchema);
// module.exports = User;