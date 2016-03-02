var passport = require('koa-passport');
var User = require('../models/user');

module.exports = function (app, router) {
  router.post('register', '/auth/register', function *(next) {
    this.validateBody('username').required();
    this.validateBody('password').required();
    this.body = yield User.createUser(new User(), this.vals.username, this.vals.password);
  });

  router.post('change-password', '/auth/change-password', function *(next) {
    this.validateBody('username').required();
    this.validateBody('password').required();
    this.validateBody('newPassword').required();
    this.body = yield User.changePassword(this.vals.username, this.vals.password, this.vals.newPassword);
  });

  router.post('login', '/auth/login', function *(next) {
    var ctx = this

    yield passport.authenticate('local', function *(err, user, info) {
      if (err) {
        throw err
      }
      if (user === false) {
        ctx.status = 401
        ctx.body = { success: false }
      } else {
        yield ctx.login(user)
        ctx.body = {
          success: true
        }
      }
    }).call(this, next)
  })

  router.get('recover', '/auth/recover', function *(next) {
    this.validateBody('username').required();
    this.body = '';
  });

  return router;
}
