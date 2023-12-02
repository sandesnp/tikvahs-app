//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

//Models
const User = require('./routes/user');

//settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //thats two underscore
app.options('*', cors());
app.use(cors());
const options = {
  key: fs.readFileSync(__dirname + '/private-key.pem'),
  cert: fs.readFileSync(__dirname + '/certificate.pem'),
};

mongoose.connect(`${process.env.MONGODB}`).then(
  () => console.log('Successfully connected'),
  (err) => console.log(err)
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //24 hrs
  })
);

//initializing passport
app.use(passport.initialize());
//using passport to deal with the sessions
app.use(passport.session());

//passport.js
require('./passport').auth(passport);

app.use('/user', User);

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }) //scope declaration as scpecified in google api
);

app.get(
  '/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_LINK + '/login',
  }),
  function (req, res) {
    // Successful authentication, redirect dashboard.
    console.log(req.user);
    res.redirect(process.env.CLIENT_LINK + '/');
  }
);

app.use(express.static(__dirname + '/client/build'));
//except for api requests all other requests will be listened by client
//matching requests will be responded
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5006;

https.createServer(options, app).listen(PORT, () => {
  console.log('Server running on https://localhost:' + PORT);
});
