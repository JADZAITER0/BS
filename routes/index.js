const router = require('express').Router();
const passport = require('passport');
const genPassword= require('../lib/passwordUtils').genPassword;
const decryptRequest = require('../lib/passwordUtils').decryptRequest;
const connection = require('../config/database');
const { json } = require('express');
const flash = require('../main').flash;
//const sockserver = require('../main').sockserver;
const User = connection.models.User;
const Device = connection.models.Device;



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
router.post('/api/v1/temprature', (req,res,next) =>{
    const device_id = req.query.device;
    //the req.bod.encryptedData will be present in the esp32 post request to the server
    console.log(req.body.encryptedData)


    //finding device with the same post request query
    Device.findOne({device_id: device_id}).then((device) => {
        console.log(device);
        
        if (!device){
            //if device does not exist return 404 status
            res.status(400).send('Invalid device Id');
        }else{
            //if device exist, decrypt the data using it shared secret key between server and client
            //then parse the reposnse as JSON
            let decryptedData = decryptRequest(device.secret_key, req.body.encryptedData);
            console.log(decryptedData);
            let jsonData;
            try{
                //parsing the decrypted data to get the content back
                //as JSON
                jsonData = JSON.parse(decryptedData);
                const deviceId = jsonData.deviceId;
                const temperature = jsonData.temp;

                if (!temperature){
                    res.status(400).send('Forged packed (JSON not correct)');
                    return;
                }

                //if the device_id in the POST body is the same as in the initial POST request
                //that means that the data was not altered so now we can add the data to the database
                if (deviceId === device_id){
                    res.send('Data Decrypted Successfully');
                    console.log('Decrypted Data:');
                    console.log('Device ID:', deviceId);
                    console.log('Temperature:', temperature);
                }else{

                    //if the device_id in the POST body is not the same as in the initial POST request
                    //that means that the POST body has been altered thus we don't add it to the database
                    res.send('Forged Packet Detected');
                }
            } catch (error) {
                //if there was an error parsing the BODY to json that means also that the request
                //has been altered
                console.log('Error parsing decrypted data as JSON:');
                res.status(400).send('Forged packed (JSON not correct)');
            };

        }
    });

    
    
});

//we made this a standalone route even though the temprature and hummidity are recieved togehter
//this will be helpfull if changes where made to the sensor and the database
router.post('/api/v1/hummidity', (req, res, next) =>{
    const device_id = req.query.device;

    //finding device with the same post request query
    Device.findOne({device_id: device_id}).then((device) => {
        console.log(device);
        
        if (!device){
            //if device does not exist return 404 status
            res.status(400).send('Invalid device Id');
        }else{
            //if device exist, decrypt the data using it shared secret key between server and client
            //then parse the reposnse as JSON
            let decryptedData = decryptRequest(device.secret_key, req.body.encryptedData);
            console.log(decryptedData);
            let jsonData;
            try{
                //parsing the decrypted data to get the content back
                //as JSON
                jsonData = JSON.parse(decryptedData);
                const deviceId = jsonData.deviceId;
                const hummidity = jsonData.hum;

                if (!hummidity){
                    res.status(400).send('Forged packed (JSON not correct)');
                    return;
                }

                //if the device_id in the POST body is the same as in the initial POST request
                //that means that the data was not altered so now we can add the data to the database
                if (deviceId === device_id){
                    res.send('Data Decrypted Successfully');
                    console.log('Decrypted Data:');
                    console.log('Device ID:', deviceId);
                    console.log('Hummidity:', hummidity);
                    //logic for hummidity databse

                }else{

                    //if the device_id in the POST body is not the same as in the initial POST request
                    //that means that the POST body has been altered thus we don't add it to the database
                    res.send('Forged Packet Detected');
                }
            } catch (error) {
                //if there was an error parsing the BODY to json that means also that the request
                //has been altered
                console.log('Error parsing decrypted data as JSON:');
                res.status(400).send('Forged packed (JSON not correct)');
            };

        }
    });

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Website interface routes and post 
router.post('/login', passport.authenticate('local',{
    failureRedirect: '/login' ,
    failureFlash: true,
    successRedirect: '/dashboard'
    })
);


//

//TODO
router.post('/addDevice', (req, res, next) =>{
    console.log(req.body.device_id);
    console.log(req.body.secret_key);
    Device.findOne({device_id: req.body.device_id,
         secret_key: req.body.secret_key}).then((device) =>{
            if (!device){
                req.flash('error','Invalid Credentials');
                res.redirect('/dashboard')
            }else{
                req.flash('success','Device Added');
                req.user.devices.push(req.body.device_id);
                req.user.save().then();
                res.redirect('/dashboard')
            }
         });
});



 // TODO
 router.post('/register', (req, res, next) => {
 
    if (!req.body.username && !req.body.password){
        req.flash('error', 'Usename & Passowrd Field are Empty');
        res.redirect("register");       
    }else if(!req.body.username){
        req.flash('error', 'Usename Field is Empty');
        req.flash('password', req.body.password);
        res.redirect("register"); 
    }else if (!req.body.password){
        req.flash('error', 'Password Field is Empty');
        req.flash('username', req.body.username);
        res.redirect("register"); 
    }else{
        User.findOne({username:  req.body.username})
        .then((exist_user) => {
                if (exist_user){
                    req.flash('error', 'Username already exists');
                    res.redirect("register");
                }else{
                    const saltHash = genPassword(req.body.password);
                    const salt = saltHash.salt;
                    const hash = saltHash.genHash;

                    const newUser= new User({
                        username: req.body.username,
                        hash: hash,
                        salt: salt
                    });

                    newUser.save().then((user) => {
                        
                    });
                    res.redirect('login');
                }
                
        });
    }
    
    
 });


 /**
 * -------------- GET ROUTES ----------------
 */


router.get('/', (req, res, next) => {


      //generateDevices
        // for (let index = 0; index < 15; index++) {
        //     const newDevice= new Device({
        //         device_id: generateRandomString(16),
        //         secret_key: generateRandomString(32),
        //         actuator_setting: []
        //     });

        //     newDevice.save().then((device) => {
        //         console.log("Inserted a new device \n");
        //     });
            
        // }
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

router.get('/deviceInfo', (req, res, next) =>{
    if (req.isAuthenticated()){
        const deviceId = req.query.device;
        if (!deviceId){
            res.send('<h1>You are not unauthorized to see this device info</h1><p>');
        }else{
            if (req.user.devices.includes(deviceId)){
                res.send('congrats');
            }else{
                res.send('<h1>You dont own this device dummy to see this device info</h1><p>');
            }

            
        }
    }
});

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