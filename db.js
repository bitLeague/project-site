var mysql = require('mysql');
var config = require('./config.json')

var connection = mysql.createConnection(process.env.JAWSDB_URL || config);

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;