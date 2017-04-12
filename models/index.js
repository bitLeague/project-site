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
            return res.send({"user" : req.body.user, "id" : result.insertId, "status":"success"});
        }
    });
});

app.post('/login', function(req, res, next) {
    console.log('request received:', req.body);
    
    var query = db.query('select * from user where username = ? and password = ?',  [req.body.user, req.body.password], function (err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        }else if(result.length > 0) {
            return res.send({"user" : result[0]["username"], "id" : result[0]["id"], "status":"success"});
        }else{
            return res.send('fail');
        }
    });
});

app.post('/ticker', function(req, res, next) {
    var request=require('request');

    request.get('https://www.bitstamp.net/api/v2/ticker/btcusd/',function(err,response,body){
      if(res.statusCode !== 200 || err){
        return res.send('fail');
      }else{
        return res.send(response);
      }
    });
});