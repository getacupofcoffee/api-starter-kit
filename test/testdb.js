require('dotenv').load();
var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;
mongoose.set('debug', false); // mongoose.set('debug', process.env.DEBUG || false);
mongoose.connect(process.env.MONGOTEST_URI || process.env.MONGOLAB_URI);
