//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

require('dotenv').config();

//Models
const User = require('./routes/user');

//settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //thats two underscore
app.options('*', cors());
app.use(cors());

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
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(flash());

//initializing passport
app.use(passport.initialize());
//using passport to deal with the sessions
app.use(passport.session());

//passport.js
require('./passport').auth(passport);

app.use('/api/user', User);

app.use(express.static(__dirname + '/client/build'));
//except for api requests all other requests will be listened by client
//matching requests will be responded
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}`);
});
