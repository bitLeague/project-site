var express = require("express");
var app = module.exports = express();
var db = require('../db.js')

app.post('/register', function(req, res, next) {
    console.log('request received:', req.body);

    var check_query = db.query('select * from user where username = ?', [req.body.user], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            return res.send({ "error": "Username already exists. Please choose a different username." });
        } else {
            var query = db.query('insert into user set name = ?, email = ?, username = ?, password = ?', [req.body.name, req.body.email, req.body.user, req.body.password], function(err, result) {
                if (err) {
                    console.error(err);
                    return res.send(err);
                } else {
                    return res.send({ "user": req.body.user, "id": result.insertId, "cash": 100000.00, "bitcoin": 0, "gains": 0.00, "status": "success" });
                }
            });
        }
    });
});

app.post('/login', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from user where username = ? and password = ?', [req.body.user, req.body.password], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            return res.send({ "user": result[0]["username"], "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        } else {
            return res.send('fail');
        }
    });
});

app.post('/getUser', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from user where username = ?', [req.body.user], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            return res.send({ "user": result[0]["username"], "id": result[0]["id"], "cash": result[0]["cash"], "bitcoin": result[0]["bitcoin"], "gains": result[0]["gains"], "status": "success" });
        } else {
            return res.send('fail');
        }
    });
});

app.post('/buy', function(req, res, next) {
    console.log('request received:', req.body);
    var cash = parseFloat(req.body.cash);
    var bid = parseFloat(req.body.bid);
    var bitcoin = parseInt(req.body.bitcoin);
    var quantity = parseInt(req.body.quantity);
    bitcoin = bitcoin + quantity;
    cash = cash - (bid * quantity);
    var gains = cash - 100000;

    // round to 2 decimals
    cash = parseFloat(Math.round(cash * 100) / 100).toFixed(2);
    gains = parseFloat(Math.round(gains * 100) / 100).toFixed(2);

    var query = db.query('update user set cash = ?, bitcoin = ?, gains = ? where id = ?', [cash, bitcoin, gains, req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            var recordOrder = db.query('insert into orders set user_id = ?, action = "Buy", quantity = ?, type = "Market", price = ?, status = "Complete"', [req.body.id, quantity, bid], function(err, result) {
                if (err) {
                    console.error(err);
                    return res.send(err);
                } else {
                    return res.send({ "cash": cash, "bitcoin": bitcoin, "gains": gains, "status": "success" });
                }
            });
        }
    });
});

app.post('/sell', function(req, res, next) {
    console.log('request received:', req.body);
    var cash = parseFloat(req.body.cash);
    var ask = parseFloat(req.body.ask);
    var bitcoin = parseInt(req.body.bitcoin);
    var quantity = parseInt(req.body.quantity);
    bitcoin = bitcoin - quantity;
    cash = cash + (ask * quantity);
    var gains = cash - 100000;

    // round to 2 decimals
    cash = parseFloat(Math.round(cash * 100) / 100).toFixed(2);
    gains = parseFloat(Math.round(gains * 100) / 100).toFixed(2);

    var query = db.query('update user set cash = ?, bitcoin = ?, gains = ? where id = ?', [cash, bitcoin, gains, req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            var recordOrder = db.query('insert into orders set user_id = ?, action = "Sell", quantity = ?, type = "Market", price = ?, status = "Complete"', [req.body.id, quantity, ask], function(err, result) {
                if (err) {
                    console.error(err);
                    return res.send(err);
                } else {
                    return res.send({ "cash": cash, "bitcoin": bitcoin, "gains": gains, "status": "success" });
                }
            });
        }
    });
});

app.post('/orders', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from orders where user_id = ? order by `time` desc limit 10 ', [req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            var ordersArr = [];
            for (var i in result) {
                ordersArr.push({ "time": result[i]["time"], "action": result[i]["action"], "quantity": result[i]["quantity"], "type": result[i]["type"], "price": result[i]["price"], "status": result[i]["status"] });
            }
            return res.send({ "orders": ordersArr, "status": "success" });
        } else {
            return res.send('nothing');
        }
    });
});

app.post('/leaders', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from user order by `gains` desc limit 10 ', function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            var leadersArr = [];
            for (var i in result) {
                leadersArr.push({ "username": result[i]["username"], "gains": result[i]["gains"] });
            }
            return res.send({ "leaders": leadersArr, "status": "success" });
        } else {
            return res.send('nothing');
        }
    });
});

app.post('/usertransactionreport', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from orders where user_id = ? order by `time` desc ', [req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            var ordersArr = [];
            for (var i in result) {
                ordersArr.push({ "time": result[i]["time"], "action": result[i]["action"], "quantity": result[i]["quantity"], "type": result[i]["type"], "price": result[i]["price"], "status": result[i]["status"] });
            }
            return res.send({ "orders": ordersArr, "status": "success" });
        } else {
            return res.send('nothing');
        }
    });
});

app.post('/systemtransactionreport', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from orders join user on id=user_id order by `time` desc limit 500 ', [req.body.id], function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            var ordersArr = [];
            for (var i in result) {
                ordersArr.push({ "username": result[i]["username"], "time": result[i]["time"], "action": result[i]["action"], "quantity": result[i]["quantity"], "type": result[i]["type"], "price": result[i]["price"], "status": result[i]["status"] });
            }
            return res.send({ "orders": ordersArr, "status": "success" });
        } else {
            return res.send('nothing');
        }
    });
});

app.post('/leadersreport', function(req, res, next) {
    console.log('request received:', req.body);

    var query = db.query('select * from user order by `gains` desc', function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else if (result.length > 0) {
            var leadersArr = [];
            for (var i in result) {
                leadersArr.push({ "username": result[i]["username"], "gains": result[i]["gains"] });
            }
            return res.send({ "leaders": leadersArr, "status": "success" });
        } else {
            return res.send('nothing');
        }
    });
});

app.post('/ticker', function(req, res, next) {
    var request = require('request');

    request.get('https://www.bitstamp.net/api/v2/ticker/btcusd/', function(err, response, body) {
        if (res.statusCode !== 200 || err) {
            return res.send('fail');
        } else {
            return res.send(response);
        }
    });
});

app.post('/chart', function(req, res, next) {
    var request = require('request');

    request.get('http://api.coindesk.com/v1/bpi/historical/close.json', function(err, response, body) {
        if (res.statusCode !== 200 || err) {
            return res.send('fail');
        } else {
            return res.send(response.body);
        }
    });
});

var json2csv = require('json2csv');

app.post('/api/v1/json-to-csv', function(req, res, next) {
    console.log('request received:', req.body);
    res.status(200).send(json2csv({ data: req.body }));
});
