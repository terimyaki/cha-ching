'use strict';
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../../../db/firebase');

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        db.userAuthWithPassword(email, password, function(err, user){
            if(err) return done(err);
            user = _.omit(user,  ['provider', 'auth']);
            user.password = user.password.email;
            user.uid = user.uid.split(':')[1];
            done(null, user);
        });
        // UserModel.findOne({ email: email }, function (err, user) {
        //     if (err) return done(err);
        //     // user.correctPassword is a method from our UserModel schema.
        //     if (!user || !user.correctPassword(password)) return done(null, false);
        //     // Properly authenticated.
        //     done(null, user);
        // });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {

        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            req.logIn(user, function (err) {
                if (err) return next(err);
                // We respond with a reponse object that has user with _id and email.
                res.status(200).send({ user: user});
                // res.status(200).send({ user: _.omit(user.toJSON(), ['password', 'salt']) });
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });

};