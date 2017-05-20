var express = require("express")
var app = module.exports = express()
var db = require('../db.js')
var bcrypt = require('bcrypt-nodejs')
var SALT_FACTOR = bcrypt.genSaltSync(10);

var userService = {}

userService.findByUsernameWithPass = function(username, callback) {
    var query = db.query('select * from user where username = ?', username, function(err, result) {
        if (err) {
            console.error("userService.findOne error: ", err);
            callback(null, err)
        } else if (result.length > 0) {
            callback({ "username": result[0]["username"], "password": result[0]["password"], "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        }
    });
};

userService.findByEmailWithPass = function(email, callback) {
    var query = db.query('select * from user where email = ?', email, function(err, result) {
        if (err) {
            console.error("userService.findOne error: ", err);
            callback(null, err)
        } else if (result.length > 0) {
            callback({ "username": result[0]["username"], "password": result[0]["password"], "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        }
    });
};

userService.findByIdWithPass = function(username, callback) {
    var query = db.query('select * from user where username = ?', username, function(err, result) {
        if (err) {
            console.error("userService.findOneById error: ", err);
            callback(null, err)
        } else if (result.length > 0) {
            callback({ "username": result[0]["username"], "password": result[0]["password"], "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        }
    });
};

userService.comparePassword = function(givenPassword, candidatePassword, callback) {
    var isMatch = bcrypt.hashSync(givenPassword, SALT_FACTOR) === candidatePassword;
    callback(isMatch);
};

userService.saltPassword = function(plainPassword, callback) {
    var passwordToSave = bcrypt.hashSync(plainPassword, SALT_FACTOR);
    callback(passwordToSave);
};
module.exports = userService;
