'use strict';

var pollModel = require('../models/poll');
var userModel = require('../models/user');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        pollModel.find({}, function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.render('index', {polls: doc});
        });

    });

    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        pollModel.find({}, function(err, doc) {
            if (err) {
                res.status(400).json({error: err});
            }

            res.render('profile', {user: req.user,
                                    polls: doc});
        });

    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/newpoll', function(req, res) {
        var entry = new pollModel(req.body);
        entry.save(function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.json(doc);
        });
    });

    app.get('/polldetails/:poll', function(req, res) {
        var params = req.params.poll;

    })

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

