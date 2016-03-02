require('dotenv').load();
var db = require('./db');
var app = require('./app')(db);
var fn = app.callback();

var options = {
  port: process.env.PORT || 5000
};

var server = require('http').createServer(fn).listen(options, function (err) {
  if (err) {
    throw err;
  }
  console.log('Koala app listening on port %s', this.address().port);
});
