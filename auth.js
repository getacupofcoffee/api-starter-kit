var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (_id, done) {
  User.findOne({ _id: _id }).exec()
    .then((user) => {
      if (!user) {
        done(new Error('Deserialize error, no user found of _id', _id));
      }
      done(null, user)
    })
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }).exec()
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' })
        }
        return user.comparePassword(password);
      })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user)
      })
      .catch((err) => {
        done(err)
      })
  }
));
