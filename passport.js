const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const USER = require('./models/user');
require('dotenv').config();

exports.auth = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' }, //since i am providing 'email' and 'password' attribute from html form
      //usernameField default is 'username' and passwordField is 'password. Both gets passed to function below as parameter.
      async function (email, password, done) {
        try {
          const foundUser = await USER.findOne({ email: email }); //find user using email

          if (!foundUser) {
            return done(null, false, "Email Doesn't Exist");
          }
          bcrypt.compare(password, foundUser.password, function (err, result) {
            //when found, encrypt the received password and match the two.
            if (err) return done(err);
            if (!result) {
              return done(null, false, "Password doesn't match");
            }

            return done(null, foundUser); //if matched then send user to be serialized.
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  //GoogleStrategy(A: make request to google, B: Play with the returned data);
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/api/user/auth/google/secrets',
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const foundUser = await USER.findOne({ email: profile._json.email });
          if (foundUser) {
            return done(null, foundUser);
          }
          const createdUser = await USER.create({ email: profile._json.email });

          return done(null, createdUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const foundUser = await USER.findById(id);
      done(null, foundUser);
    } catch (err) {
      done(err);
    }
  });
};
