var express = require("express")
var app = module.exports = express()
var db = require('../db.js')

var userService = {}

userService.findByUsernameWithPass = function(username, callback) {
    var query = db.query('select * from user where username = ?', username, function(err, result) {
        if (err) {
            console.error("userService.findOne error: ", err);
            callback(null, err)
        } else if (result.length > 0) {
            callback({ "username": result[0]["username"], "password": result[0]["password"],  "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        } 
    });
};

userService.findByIdWithPass = function(username, callback) {
    var query = db.query('select * from user where username = ?', username, function(err, result) {
        if (err) {
            console.error("userService.findOneById error: ", err);
            callback(null, err)
        } else if (result.length > 0) {
            callback({ "username": result[0]["username"], "password": result[0]["password"],  "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        } 
    });
};

module.exports = userService;
