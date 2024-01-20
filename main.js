const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const websocket = require('ws');
const connection = require('./config/database');
const json = express.json();


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



/**
 * -------------- SERVER ----------------
 */

// Server listens on http://192.168.0.10:3000
app.listen(3000,'192.168.0.9',() => {
    console.log('Server listening on http://192.168.0.9:3000');
});


module.exports.flash = flash;
//module.exports.sockserver = sockserver;