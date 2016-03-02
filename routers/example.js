var HttpError = require('http-errors');
var debug = require('debug')('routes:example');

function checkAuthentication (ctx, isAllowed) {
  if (!ctx.isAuthenticated()) {
    debug('not isAuthenticated request', ctx.request);
    throw new HttpError[401]('You must be authenticated');
  }
  if (isAllowed === false) {
    debug('not allowed request', ctx.request);
    throw new HttpError[403]()
  }
}


module.exports = function (app, router) {
  router.get('home', '/home', function *(next) {
    this.body = {
      message: 'Welcome home'
    };
  });

  router.get('authenticated', '/authenticated', function *(next) {
    // authenticated route
    checkAuthentication(this);
    this.body = {
      message: 'This is an authenticated route'
    }
  });

  router.get('custom-authenticated', '/custom-authenticated', function *(next) {
    // authenticated route accessible only for user whose username begin by 'a' letter
    const user = this.req.user
    const usernameRegExp = /^a/

    checkAuthentication(this, !user ? false : usernameRegExp.test(user.username))
    this.body = {
      message: 'This is a custom authenticated routes for user whose username\'s first letter is \'a\' '
    }
  });

  router.get('user personalized authenticated route', '/authenticated/:username', function *(next) {
    // authenticated route accessible only for the user itself
    this.validateParam('username').required()
    const user = this.req.user

    checkAuthentication(this, !user ? false : this.vals.username === user.username)
    this.body = {
      message: 'This is a personalized authenticated route for user '+this.vals.username
    }
  });

  return router;
};
