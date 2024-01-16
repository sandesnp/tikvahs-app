//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

//routes
const USER = require('./routes/user');
const PRODUCT = require('./routes/product');
const IMAGE = require('./routes/image');
const ADMIN = require('./routes/admin');
const ORDER = require('./routes/order');

//settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //thats two underscore
app.options('*', cors());
app.use(cors());
app.get('/', (req, res) => {
  res.send('just checking');
});

mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  function () {
    console.log(`Successfully connected to mongodb server`);
  }
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

//initializing passport
app.use(passport.initialize());
//using passport to deal with the sessions
app.use(passport.session());

//passport.js
// require('./passport').auth(passport);

//adding routes to middleware
// app.use('/api/user', USER);
// app.use('/api/product', PRODUCT);
// app.use('/api/image', IMAGE);
// app.use('/api/order', ORDER);
// app.use('/admin', ADMIN);

app.use(express.static(__dirname + '/client/build'));
//except for api requests all other requests will be listened by client
//matching requests will be responded
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, function () {
  console.log(`App running on port ${PORT}`);
});
