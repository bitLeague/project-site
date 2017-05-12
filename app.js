var express = require('express')
var cons = require('consolidate')
var routes = require('./server/routes/')
var models = require('./server/models/')
var path = require('path')
var db = require('./server/db')
var mysql = require('mysql')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()
// AUTH
var session = require('express-session')
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var passport = require('./server/config/passport')
var helmet = require('helmet')

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');

// allows access to the following folders from html
app.use("/node_modules", express.static('node_modules'));
app.use("/public", express.static(path.join(__dirname, 'public')));

// Security
app.use(helmet())
// request body parser
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ secret: 'bitleague is awesome', resave: false, saveUninitialized: false })) // Should be in env var
app.use(passport.initialize());
app.use(passport.session());


app.use(routes)
app.use(models)

var users = require('./server/services/users')

var user = users.findByUsernameWithPass('testy', function(user, err) {
    if(err) {
      console.log("ERRORf")
    } else {
      console.log("FOUND: ", user.username, user.password)
    }
})

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
})
    
