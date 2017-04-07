var express = require("express");
var app = module.exports = express(); 
var db = require('../db.js')

app.post('/register', function(req, res, next) {
    console.log('request received:', req.body);
    
    var query = db.query('insert into user set name = ?, email = ?, username = ?, password = ?',  [req.body.name, req.body.email, req.body.user, req.body.password], function (err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            return res.send('success');
        }
    });
});