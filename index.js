require('dotenv').config();
const Sequelize = require('sequelize');
const epilogue = require('epilogue'), ForbiddenError = epilogue.Errors.ForbiddenError;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const app = express();


const PORT = process.env.PORT || 3000;

app.use(session({
    secret: process.env.RANDOM_SECRET_WORD,
    resave: true,
    saveUninitialized: false,
}));

const oidc = new ExpressOIDC({
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URL,
    scope: 'openid profile',
    routes: {
        callback: {
            path: 'authorization-code/callback',
            defaultRedirect: '/Admin',
        }
    }
});

app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());

//user routes
app.get('/', (req, res) => {
    res.send('<h1>Hello There</h1><a href="/login">Login</a>');
});

app.get('/admin', oidc.ensureAuthenticated(),(req, res) => {
    res.send('Admin Page');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/home');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

// app.listen(PORT, () => {
//     console.log('server is working');
// });

//sqlite database
const database = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    operatorsAliases: false,
});

const Post = database.define('posts', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
});

epilogue.initialize({ app, sequelize: database });

const PostResource = epilogue.resource({
    model: Post,
    endpoints: ['/posts', '/posts/:id']
});

PostResource.all.auth(function(req, res, context) {
    return new Promise(function (resolve, reject) {
        if (!req.isAuthenticated()) {
            res.status(401).send({ message: 'Unauthorized' });
            resolve(context.stop);
        } else { 
            resolve(context.continue);
        }
    })
});

database.sync().then(() => {
    oidc.on('ready', () => {
        app.listen(PORT, () => console.log(`My Blog app is listening on port ${PORT}`));
    });
});

oidc.on('error', err => {
    console.log("oidc error: ", err);
})