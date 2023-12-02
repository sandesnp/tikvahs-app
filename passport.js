const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const USER = require('./models/user');
require('dotenv').config();

exports.auth = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/auth/google/secrets',
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
