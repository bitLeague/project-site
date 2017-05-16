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
var MySQLStore = require('express-mysql-session')(session);
var storeOptions = {
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds. 
    expiration: 86400000,// The maximum age of a valid session; milliseconds. 
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist. 
    connectionLimit: 1,// Number of connections when creating a connection pool 
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
var sessionStore = new MySQLStore({}/* session store options */, db);
var passport = require('./server/config/passport')
var helmet = require('helmet')

var nodemailer = require('nodemailer')

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
app.use(session({ secret: 'bitleague is awesome', store: sessionStore, resave: false, saveUninitialized: false })) // Secret Should be in env var
app.use(passport.initialize());
app.use(passport.session());


app.use(routes)
app.use(models)

let port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Listening on port ' + port);
})
    
