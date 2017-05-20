var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var bcrypt = require('bcrypt-nodejs')
var async = require('async')
var crypto = require('crypto')
var users = require('../services/users')
var db = require('../db.js')

passport.use(new FacebookStrategy({
        clientID: "1322511904537188",
        clientSecret: "092df5eebead2ff4d94e6d6ea7111029",
        callbackURL: "http://localhost:8000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
        //console.log("PROFILE", profile);

        var tempUser = {
            name: profile.displayName,
            email: profile.emails[0].value,
            facebookid: profile.id,
            facebooktoken: accessToken
        };

        db.query("SELECT * FROM user WHERE email = ?", [tempUser.email], function(err, rows) {
            if (err) return done(err);
            if (rows.length) {
                var user = { "name": rows[0]["name"], "username": rows[0]["username"], "id": rows[0]["id"], "cash": rows[0]["cash"], "bitcoin": rows[0]["bitcoin"], "gains": rows[0]["gains"], "status": "success" };
                db.query('update user set facebookid = ?, facebooktoken = ? where email = ?', [tempUser.facebookid, tempUser.facebooktoken, tempUser.email], function(err, rows) {
                    if (err) return done(err);
                    console.log("Facebook ID ADDED Check DB!");
                    return done(null, user);
                });
            } else {
                crypto.randomBytes(20, function(err, buf) {
                    var tempPassword = buf.toString('hex');
                    db.query('insert into user set name = ?, email = ?, username = ?, password = ?, facebookid = ?, facebooktoken = ?', [tempUser.name, tempUser.email, tempUser.email, tempPassword, tempUser.facebookid, tempUser.facebooktoken], function(err, rows) {
                        if (err) return done(err);
                        var user = { "name": tempUser.name, "username": tempUser.email, "id": rows.insertId, "cash": 100000.00, "bitcoin": 0, "gains": 0, "status": "success" };
                        done(null, user);
                    });
                });
            }
        });
    }
));

passport.use(new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, function(req, username, password, done) {
    users.findByUsernameWithPass(username, function(user, err) {
        if (err) return done(err);
        if (!user) return done(null, false, { error: 'Incorrect username.' });
        users.comparePassword(password, user.password, function(isMatch) {
            console.log("checking password is match", isMatch);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { error: 'Incorrect password.' });
            }
        });

    });
}));

passport.use(
    'local-signup',
    new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'user',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM user WHERE username = ?", [username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, { error: username + ' is not available.' });
                } else {
                    // if there is no user with that username
                    // create the user
                    users.saltPassword(req.body.password, function(hash) {
                        db.query('insert into user set name = ?, email = ?, username = ?, password = ?', [req.body.name, req.body.email, req.body.user, hash], function(err, rows) {
                            return done(null, rows.insertId);
                        });
                    });

                }
            });
        })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    if (!id) return;
    db.query("SELECT * FROM user WHERE id = ? ", [id], function(err, rows) {
        done(err, rows[0]);
    });
});

module.exports = passport
