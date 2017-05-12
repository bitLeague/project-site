var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt-nodejs')
var async = require('async')
var crypto = require('crypto')
var users = require('../services/users')
var db = require('../db.js')

passport.use(new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, function(req, username, password, done) {
    users.findByUsernameWithPass(username, function(user, err) {
        if (err) return done(err);
        if (!user) return done(null, false, { error: 'Incorrect username.' });
        if (password === user.password) {
            return done(null, user);
        } else {
            return done(null, false, { error: 'Incorrect password.' });
        }
    });
}));

passport.serializeUser(function(user, done) {
    console.log("serializeUser?");
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM user WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

module.exports = passport
