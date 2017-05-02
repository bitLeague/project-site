var express = require('express')
var cons = require('consolidate')
var routes = require('./server/routes/')
var models = require('./server/models/')
var path = require('path')
var db = require('./server/db')
var mysql = require('mysql')
var app = express()
var bodyParser = require('body-parser')

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');

// allows access to the following folders from html
app.use("/node_modules", express.static('node_modules'));
app.use("/public", express.static('public'));

// request body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(routes)
app.use(models)

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
})
    
