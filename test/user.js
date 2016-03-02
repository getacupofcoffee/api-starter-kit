// test user :
// tests the user Model used to authenticate

require('./testdb');

var assert = require('assert');
var User = require('../models/user');
var Promise = require('bluebird');

const TEST_USERNAME = 'coucou'
const TEST_PASSWORD = 'desbois'
const NEW_PASSWORD = 'dulac'
const WRONG_PASSWORD = 'aaaaaaa'

describe('User Model tests', () => {
  before((done) => {
    console.log('----> Removing all existing users from test db before tests')
    User.remove({ }).exec()
      .then(() => {
        console.log(
          '----> Creating test user with username ' + TEST_USERNAME + ' and password '
          + TEST_PASSWORD + ' for the tests'
        );
        return User.createUser(new User(), TEST_USERNAME, TEST_PASSWORD)
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

  describe('password match test', () => {
    it('should success when the right password is given', (done) => {
      return User.findOne({ username: TEST_USERNAME }).exec()
        .then((user) => {
          if (!user) {
            throw new Error('user not found :' + user)
          }
          assert.equal(user.username, TEST_USERNAME);
          assert.notEqual(user.password, TEST_PASSWORD);
          return user.comparePassword(TEST_PASSWORD)
        })
        .then((user) => {
          if (!user) {
            throw new Error('Password ' + TEST_PASSWORD + 'should be valid but User Model says it\'s invalid ');
          }
          done();
        })
        .catch((err) => {
          done(err)
        })
    });

    it('should fail when a wrong password is given', (done) => {
      return User.findOne({ username: TEST_USERNAME }).exec()
        .then((user) => {
          return user.comparePassword(WRONG_PASSWORD)
        })
        .then((user) => {
          if (user) {
            throw new Error('Password ' + WRONG_PASSWORD + ' matches but it shouldn\'t')
          }
          done()
        })
        .catch((err) => {
          done(err)
        })
    });
  });

  describe('password change test', () => {
    it('should change password, match the new password and not the old one', (done) => {
      return User.changePassword(TEST_USERNAME, TEST_PASSWORD, NEW_PASSWORD)
        .then((result) => {
          if (result.error) {
            throw result.error
          }
          assert.equal(result.passwordChanged, true)
          return User.findOne({ username: TEST_USERNAME })
        })
        .then((user) => {
          return user.comparePassword(NEW_PASSWORD)
        })
        .then((user) => {
          if (!user) {
            throw new Error('Password ' + NEW_PASSWORD + 'should be valid but User Model says it\'s invalid ');
          }
          return user;
        })
        .then((user) => {
          return user.comparePassword(TEST_PASSWORD)
        })
        .then((user) => {
          if (user) {
            throw new Error('Old password ' + TEST_PASSWORD + ' matches but it shouldn\'t')
          }
          done()
        })
        .catch((err) => {
          done(err)
        })
    });
  });
});
