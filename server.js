const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();
const passport = require('passport');
const cookieParser = require('cookie-parser');

const routes = require('./server/config/routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
    bodyParser.json(),
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use(bodyParser.urlencoded({
    extended: true
}))

// required for passport
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

routes(app, passport);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/`);
});
