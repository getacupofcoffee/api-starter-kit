// authentication module
require('./auth')

// libs
const koala = require('koala');
const cors = require('koa-cors');
const path = require('path');
const json = require('koa-json');
const passport = require('koa-passport')
const session = require('koa-generic-session')
const debug = require('debug')('app')

var app = koala()

app.keys = ['azertytreza']
app.use(session())

app.use(require('koa-file-server')({
  root: path.join(__dirname, 'public')
}));

app.use(cors({
  origin: '',
  credentials: false
}));

const bouncer = require('koa-bouncer');

app.use(function *(next) {
  this.request.body = yield* this.request.json();
  yield* next
})

app.use(bouncer.middleware());

app.use(json());

app.use(passport.initialize());
app.use(passport.session());

app.use(function *(next) {
  try {
    yield* next;
  } catch (err) {
    this.status = err.status || 500;

    if (this.status === 500) {
      debug('Internal error', err)
    }

    if (err instanceof bouncer.ValidationError) {
      this.status = 400; // bad request
    }

    this.body = err.message || 'The server made a boo';
  }
});

require('./routers')(app);

module.exports = function (database) {
  app.db = database;
  return app;
}

