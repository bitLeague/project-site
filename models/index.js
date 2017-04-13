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
            return res.send({"user" : result[0]["username"], "id" : result[0]["id"], "cash" : result[0]["cash"], "bitcoin" : result[0]["bitcoin"], "gains" : result[0]["gains"], "status":"success"});
        }else{
            return res.send('fail');
        }
    });
});

app.post('/buy', function(req, res, next) {
    console.log('request received:', req.body);
    var cash = req.body.cash;
    var bid = req.body.bid;
    var bitcoin = req.body.bitcoin;
    var quantity = req.body.quantity;
    bitcoin = bitcoin + parseInt(quantity);
    cash = cash - (bid * quantity);
    var gains = cash - 100000;

    // round to 2 decimals
    cash = parseFloat(Math.round(cash * 100) / 100).toFixed(2);
    gains = parseFloat(Math.round(gains * 100) / 100).toFixed(2);
    
    var query = db.query('update user set cash = ?, bitcoin = ?, gains = ? where id = ?',  [cash, bitcoin, gains, req.body.id], function (err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        }else{
            var recordOrder = db.query('insert into orders set user_id = ?, action = "Buy", quantity = ?, type = "Market", price = ?, status = "Complete"',  [req.body.id, quantity, bid], function (err, result) {
                if (err) {
                    console.error(err);
                    return res.send(err);
                }else{
                    return res.send({"cash" : cash, "bitcoin" : bitcoin, "gains" : gains, "status":"success"});
                }
            });
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