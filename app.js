// Hook into the db with this - 'mongo': process.env.MONGODB_URI || "mongodb://localhost:27017/bitmarkit";

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})