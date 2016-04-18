'use strict';

/**
 * setup server
 */
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var path = require('path');
var favicon = require('serve-favicon');
var port = process.env.PORT || 3000;
var dbURI = process.env.MONGOLAB_URI || process.env.MONGODB_URI || configDB.url;

/**
 * connect to database
 */
mongoose.connect(dbURI);

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
    process.exit(0);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// only start server if successfully connected to database
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);

    /**
     * configure our server
     */
    var app = express();

    require('./config/passport')(passport);

    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
    app.use('/public', express.static('public'));
    app.set('view engine', 'ejs');

    /**
     * Passport configurations
     */
    app.use(session({
                        secret: 'fccvotingappsecret',
                        resave: false,
                        saveUninitialized: true
                    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    require('./routes/index.js')(app, passport);

    /**
     * start server
     */
    app.listen(port, function() {
        console.log('Server listening on port ' + port + '...');
    });

});





