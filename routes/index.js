const router = require('express').Router();
const passport = require('passport');
const decryptRequest = require('../lib/passwordUtils').decryptRequest;
const connection = require('../config/database').connection;
const { json } = require('express');
const flash = require('../main').flash;
const User = require('../models/user');
const Device = require('../models/device');
const userController = require('../controllers/user.controller');
const deviceController = require('../controllers/device.controller');
const PACKET_TYPE = require('../constants/packetType.constants').PACKET_TYPE;

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
}

/**
 * WebSocket to handle saved configuration file on the server side
 * so that they get uploaded to the esp32 (nodes).
 */


  



/**
 * -------------- POST ROUTES ----------------
*/

//---------------------------------------------
//API routes for handeling uploaded data
//---------------------------------------------
router.post('/api/v1/temprature/:id/', (req, res, next) => deviceController.decryptData(req, res, next, PACKET_TYPE.TEMPRATURE));

//we made this a standalone route even though the temprature and hummidity are recieved togehter
//this will be helpfull if changes where made to the sensor and the database
router.post('/api/v1/hummidity/:id/', (req, res, next) => deviceController.decryptData(req, res, next, PACKET_TYPE.HUMIDITY));

router.post('/api/v1/light/:id/', (req, res, next) => deviceController.decryptData(req, res, next, PACKET_TYPE.LIGHT));

router.post('/api/v1/moisture/:id/', (req, res, next) => deviceController.decryptData(req, res, next, PACKET_TYPE.MOISTURE));

router.post('/api/v1/carbon/:id/', (req, res, next) => deviceController.decryptData(req, res, next, PACKET_TYPE.CO2));

router.get('/api/v1/deviceData/temprature/:id/', (req, res, next) => deviceController.getData(req, res, next, PACKET_TYPE.TEMPRATURE));

router.get('/api/v1/deviceData/hummidity/:id/', (req, res, next) => deviceController.getData(req, res, next, PACKET_TYPE.HUMIDITY));

router.get('/api/v1/deviceData/light/:id/', (req, res, next) => deviceController.getData(req, res, next, PACKET_TYPE.LIGHT));

router.get('/api/v1/deviceData/moisture/:id/', (req, res, next) => deviceController.getData(req, res, next, PACKET_TYPE.MOISTURE));

router.get('/api/v1/deviceData/carbon/:id/', (req, res, next) => deviceController.getData(req, res, next, PACKET_TYPE.CO2));




///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Website interface routes and post 
router.post('/login', userController.login);


//

//TODO
router.post('/addDevice', deviceController.addDevice);


router.post('/removeDevice', deviceController.removeDevice);
 // TODO
 router.post('/register', userController.register);

 /**
 * -------------- GET ROUTES ----------------
 */


router.get('/', (req, res, next) => {

        // for (let index = 0; index < 15; index++) {
        //     const newDevice= new Device({
        //         device_id: generateRandomString(16),
        //         secret_key: generateRandomString(32),
        //         actuator_setting: [],
        //         user_linked: [],
        //         sensor_setting:  {temprature: 2,
        //             hummidity:2,
        //             moisture:2,
        //             carbon_dioxide:2,
        //             light:0,
        //          },
        //         sensor_data: {temprature:[],
        //             hummidity: [],
        //             moisture: [],
        //             carbon_dioxide: [],
        //             light: [],
        //             pressure: [],
        //             }
        //     });

        //     //save the new device to the database
        //     newDevice.save()
        //         .then(device => {
        //             console.log(device);
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         });
        //     }
    res.render('../templates/home');
});



// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
    const error = req.flash('error')[0];
    res.render('../templates/login',{error: error});

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    //gets the error message from the redirect of the post request of the
    //login page
    const error = req.flash('error')[0];
    const username = req.flash('username')[0];
    const password = req.flash('password')[0];

    
    res.render('../templates/register',{error: error, username: username, password: password});
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/dashboard', (req, res, next) => {
    
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render('../templates/dashboard', { devices: req.user.devices, error: req.flash('error')[0]});
        // res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/:id/deviceInfo',deviceController.getDeviceInfo);

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/dashboard');
    });
    res.redirect('/dashboard');
});

router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/dashboard">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;