require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const restrict = require('./middleware/restricted.js');
const attachTokenToHeaders = require('./middleware/attachTokenToHeaders');

const secrets = require('../config/secrets');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const usersRouter = require('./users/users-router.js');

const server = express();

const sessionConfig = {
    name:'dadjokesgiver',
    secret:secrets.jwtSecret,
    cookie: {
        maxAge:1000*30,
        secure:false,
    },
    httpOnly:true,
    resave:false,
    saveUninitialized:false
}
server.use(session(sessionConfig));
server.use(helmet());
server.use(cors());
server.use(express.json());


server.use('/api/auth', authRouter);
server.use('/api/jokes', attachTokenToHeaders, restrict, jokesRouter); // only logged-in users should have access!
server.use('/api/users', usersRouter);
module.exports = server;
