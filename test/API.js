// test API :
// tests all the existing routes of the app
// uses a special test database

var request = require('supertest');
var test_db = require('./testdb');
var app = require('../app')(test_db);
var User = require('../models/user');
var fn = app.callback();
var options = {
  port: process.env.TEST_PORT || 5000
};

var server = require('http').createServer(fn).listen(options, function (err) {
  if (err) {
    throw err;
  }
  console.log('Koala test app listening on port %s', this.address().port);
})


describe('authentication routes', () => {
  before((done) => {  // get an available human id before running the tests
    return User.remove({}).exec()
      .then(() => {
        done()
      });
  });

  describe('register', () => {
    it('should create a user', function (done) {
      request(server)
        .post('/auth/register')
        .send({
          username: 'a@a.a',
          password: 'a'
        })
        .expect(200)
        .end(done)
    });
  });

  describe('login', () => {
    it('should log the user in', (done) => {
      request(server)
        .post('/auth/login')
        .send({
          username: 'a@a.a',
          password: 'a'
        })
        .expect((res) => {
          return res.body.success === true;
        })
        .end(done);
    });

    it('should fail beacause of wrong password', (done) => {
      request(server)
        .post('/auth/login')
        .send({
          username: 'a@a.a',
          password: 'b'
        })
        .expect(401)
        .expect((res) => {
          return res.body.success === false;
        })
        .end(done);
    });
  });

  describe('change password', () => {
    it('should change the user\'s password', (done) => {
      request(server)
        .post('/auth/change-password')
        .send({
          username: 'a@a.a',
          password: 'a',
          newPassword: 'b'
        })
        .expect(200)
        .expect((res) => {
          return res.body.passwordChanged === true;
        })
        .end(done);
    });

    it('should not the user\'s password', (done) => {
      request(server)
        .post('/auth/change-password')
        .send({
          username: 'a@a.a',
          password: 'a',
          newPassword: 'c'
        })
        .expect(200)
        .expect((res) => {
          return res.body.passwordChanged === false;
        })
        .end(done);
    });
  });
});
