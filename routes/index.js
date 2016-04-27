'use strict';

var pollModel = require('../models/poll');

module.exports = function(app, passport) {

    app.use(function (req, res, next) {
        res.locals.login = req.isAuthenticated();
        next();
    });

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
        pollModel.find({email: req.user.email}, function(err, doc) {
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

    app.get('/newpoll', isLoggedIn, function(req, res) {
        res.render('newpoll');
    });

    app.post('/newpoll', function(req, res) {
        var entry = req.body;
        entry.email = req.user.email;
        console.log('entry', entry);

        var newPoll = new pollModel(entry);
        newPoll.save(function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.json({status: 'ok'});
        });
    });

    app.get('/polldetails/:poll', function(req, res) {
        var params = req.params.poll;

        pollModel.find({_id: params}, function(err, doc) {
            if (err) {
                return res.json(400).json({error: err});
            }

            if (req.isAuthenticated()) {
                res.render('polldetails', {polldetail: doc[0], user: true });
            } else {
                res.render('polldetails', {polldetail: doc[0], user: false });
            }

        });
    });

    app.get('/mypolls', isLoggedIn, function(req, res) {
        pollModel.find({email: req.user.email}, function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.render('mypolls', {polls: doc});
        });
    });

    app.delete('/deletepoll/:id', function(req, res) {
        var params = req.params.id;

        pollModel.find({_id: params}).remove(function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.json({pollDeleted: true});
        });
    });

    app.post('/pollVote/', function(req, res) {
        var entry = req.body;
        var votestr = 'votes.' + entry.itemNum;
        var updateStr = {};
        updateStr['$inc'] = {};
        updateStr['$inc'][votestr] = 1;

        pollModel.findOneAndUpdate({_id: entry.id}, updateStr ).exec(function(err, doc) {
            if (err) {
                return res.status(400).json({error: err});
            }

            res.json({status: 'ok'});
        });
    });

    app.get('/test/endpoint', function(req, res, next) {
        res.json({ status: 'OK' });
    });

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

