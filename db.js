var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.set('debug', process.env.DEBUG || false);
mongoose.connect(process.env.MONGOLAB_URI);
