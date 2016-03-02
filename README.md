# koa-node-mongoose API starter kit

Starter kit for building API based on node, koa and mongoose.
Authentication routes (register and login) based on [Passport](https://github.com/jaredhanson/passport) are implemented (see `routers/auth.js`) with cookie based sessions.
Examples of authenticated and custom routes are given (see `routers/example.js`).

## Installation

Requires node >=4.2.0 (usage of ES6).

Install packages dependencies with `npm install`.

## Dependencies

 - bluebird : lib for js promise.
 - cpy : lib for copying files.
 - dotenv : read environnement variables in .env file and access it in node via `process.env.<variable>`.
 - got : friendly http lib.
 - koala : koa server in ES6 with utils
 - koa-... : utils for koala.
 - mongodb : database.
 - mongoose : database access lib.
 - koa-passport : [Passport](https://github.com/jaredhanson/passport) middleware for Koa
 - bcrypt: lib to help you hash passwords
 - debug : debug console logs
 - eslint : js linter
 - http-errors : create HTTP errors for Express, Koa, Connect, etc. with ease.
 - passport-local : local authentication strategy for passport

## Usage

### Define environnement variables

First you need to define environnement variables for dotenv lib.
You must create a .env file at the root of the project. The following variables are necessary :
```
PORT = <listening port, default 5000>
NODE_ENV = <development/test>
DEBUG = <true/false>
MONGOLAB_URI = <uri of the mongodb database>
MONGOTEST_URI = <uri of the mongodb test database>
```

### Run
Run it with command `node index.js`.

### Test in command line using curl
You can test the register routes and the example routes using curl.
First register:
```
curl -X POST --data '{"username": "<username>", "password": "<password>"}' http://localhost:<PORT>/auth/register
```
Then login . You must give a filename to store cookies :
```
curl -c <cookie_store_filename> -X POST --data '{"username": "<username>", "password": "<password>"}' http://localhost:<PORT>/auth/register
```
Test the home route, which is not authenticated (cookie not needed) :
```
curl -X GET http://localhost:<PORT>/home
```
Test the authenticated route :
```
curl -b <cookie_store_filename> -X GET http://localhost:<PORT>/authenticated
```
Retry without giving the cookies file name, you will be unauthorized :
```
curl -X GET http://localhost:<PORT>/authenticated
```
You can also test the custom route which accessible for user whose username begin with the letter 'a' :
```
curl -b <cookie_store_filename> -X GET http://localhost:<PORT>/cutom-authenticated
```
or the personalised route that only the user can use :
```
curl -b <cookie_store_filename> -X GET http://localhost:<PORT>/authenticated/<username>
```

## Contributing

## History

## Credits


## License

