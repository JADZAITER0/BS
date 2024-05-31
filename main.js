const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const websocket = require('ws');
const connection = require('./config/database');


// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();
const expressWs = require('express-ws');
const WebSocket = require('ws');
const { Console } = require('console');
const wsInstance = expressWs(app);
const aWss = wsInstance.getWss('/');

const deviceConnections = new Map();




//const sockserver = new websocket("http://192.168.0.10:443" );

//for ejs templates
app.set('view engine', 'ejs');
app.use('/stylesheets', express.static('public/stylesheets', { 'extensions': ['css'], 'index': false }));
app.use('/scripts', express.static('public/scripts', { 'extensions': ['js'], 'index': false }));

//parsing http responses
app.use(express.json());
app.use(express.urlencoded({extended: true}));



/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStorage = MongoStore.create({
     mongoUrl: 'mongodb://localhost:27017/server',
     collection: 'session'

});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: sessionStorage
}));

app.use(flash());

/** Test
app.get('/', (req , res , next) => {
    if (req.session.viewcount){
        req.session.viewcount = req.session.viewcount +1;
    }else{
        req.session.viewcount= 1;
    }
    res.send(`<h1>you visited ${req.session.viewcount} </h1>`);
})
 */





/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require('./config/passport');



//middlewears
app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */



// Imports all of the routes from ./routes/index.js
app.use(routes);


// app.post('/:id/settings', (req, res) => {
//     const clientToken = req.params.id;
//     const setting= req.body.setting;
  
//     // Check if the device with the given token is connected
//     if (deviceConnections.has(clientToken)) {
//       const ws = deviceConnections.get(clientToken);
  
//       // Send the setting change to the connected device
//       ws.send(JSON.stringify({
//         type: 'uwu',
//       }));
  
//       res.status(200).json({ message: 'Setting change request processed successfully.' });
//     } else {
//       res.status(404).json({ error: 'Device not found.' });
//     }
// });

// app.ws('/:id/', function (ws, req) {
//     // Add the new connection to the list
//     console.log(req.socket.remoteAddress);
//     aWss.clients.add(ws);
//     deviceConnections.set(req.params.id, ws);
    
//     ws.on('message', function (msg) {
//         console.log(msg);

        
//     });
//     ws.on('close', function () {
//         console.log("Closed");
//         aWss.clients.delete(ws);
//         deviceConnections.delete(req.params.id);
//     });


// });


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://192.168.1.5:3000
app.listen(3002,'172.16.25.227',() => {
    console.log('Server listening on http://172.16.25.227:3002');
});


module.exports.flash = flash;
//module.exports.sockserver = sockserver;    