// Hook into the db with this - 'mongo': process.env.MONGODB_URI || "mongodb://localhost:27017/bitmarkit";

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

//
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
})