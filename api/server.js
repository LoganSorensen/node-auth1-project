const express = require("express");
const session = require('express-session');
const knexStore = require('connect-session-knex')(session);

const apiRouter = require("./api-router.js");
const knex = require('../database/dbConfig.js')

const server = express();

const sessionConfig = {
    name: 'cookie',
    secret: 'keep it secret, keep it safe',
    resave: false,
    saveUninitializaed: true, //related to GDPR compliance
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false, //should be true in production
        httpOnly: true
    },
    //set up store so that session remains after server restart
    store: new knexStore({
        knex,
        tablename: 'sessions',
        createtable: true,
        sidfieldname: 'sid',
        clearInterval: 1000 * 60 * 10
    })
}

server.use(express.json());
server.use(session(sessionConfig))

server.use("/api", apiRouter);

server.get('/', (req, res) => {
    console.log(req.session)
    res.json({ api: 'is working' })
})

module.exports = server;
