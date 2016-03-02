var router = require('koa-router')();

module.exports = function (app) {
  require('./auth')(app, router);
  require('./example')(app, router);

  router.get('/', function *(next) {
    this.body = 'Home';
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
