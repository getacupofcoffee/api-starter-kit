var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Promise = require('bluebird');
var debug = require('debug')('models:user');

const hashPassword = function (password) {
  return Promise.resolve()
    .then(() => {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          if (err) {
            reject(err);
          }
          resolve(salt);
        })
      })
    })
    .then((salt) => {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err)
          }
          resolve(hash)
        });
      })
    })
}

const comparePassword = function (candidatePassword, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, hashedPassword, (err, isMatch) => {
      if (err) {
        reject(err);
      }
      resolve(isMatch)
    })
  })
}

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

UserSchema.pre('save', function (next) {
  return Promise.resolve()
    .then(() => {
      if (!this.isModified('password')) {
        return null
      }
      return hashPassword(this.password)
    })
    .then((hashedPassword) => {
      if (hashedPassword) {
        this.password = hashedPassword
      }
      next()
    })
    .catch((err) => {
      next(err)
    })
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return comparePassword(candidatePassword, this.password)
    .then((isMatch) => {
      if (!isMatch) {
        return false;
      }
      return this;
    })
};

UserSchema.statics.changePassword = function (username, actualPassword, newPassword) {
  return User.findOne({ username: username })
    .then((user) => {
      return user.comparePassword(actualPassword)
    })
    .then((user) => {
      if (user === false) {
        throw new Error('invalid password')
      }
      user.password = newPassword;
      return user.save()
    })
    .then(() => {
      return {
        passwordChanged: true
      }
    })
    .catch((err) => {
      return {
        passwordChanged: false,
        error: err
      }
    })
}

UserSchema.statics.createUser = function (newUser, username, password, lat, lng) {
  newUser.username = username;
  newUser.password = password;
  return newUser.save()
    .then((user) => {
      return {
        userCreated: true
      };
    })
    .catch((err) => {
      return {
        userCreated: false,
        error: err
      };
    })
}

var User = mongoose.model('User', UserSchema);

module.exports = User
