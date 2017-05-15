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

passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'user',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM user WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, { error: username + ' is not available.' });
                } else {
                    // if there is no user with that username
                    // create the user
                    db.query('insert into user set name = ?, email = ?, username = ?, password = ?', [req.body.name, req.body.email, req.body.user, req.body.password], function(err, rows) {
                        return done(null, rows.insertId);
                    });
                }
            });
        })
    );

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM user WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

module.exports = passport
