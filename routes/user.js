const express = require('express');
const USER = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkAuthenticated } = require('./auth-middleware');

router.post('/createpassword', checkAuthenticated, async (req, res, next) => {
  console.log(req.user);
  //check first if the sent passwords match or not.
  if (req.body.password !== req.body.repassword)
    return res.status(400).json({
      error: 'PasswordMismatch',
      message: 'The new password and confirmation password do not match.',
    });

  //hash the password
  bcrypt.hash(req.body.password, 10, async function (err, hash) {
    if (err) throw new Error('Could not encrypt password!');
    try {
      const body = { email: req.user.email, password: hash };

      //put the password inside already created user.
      USER.findByIdAndUpdate({ _id: req.user._id }, body, { new: true }).then(
        (response) => {
          console.log('Created Password', response);
          return res.status(200).json({ message: 'Password was created' });
        }
      );
    } catch (error) {
      // Handle errors during the update operation
      console.error('Error during update:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

//login local
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Authentication failed
      //info is the third parameter in the done callback from passportjs
      return res.status(401).json({ success: false, message: info });
    }

    // seraliza the user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ success: true, navigateLink: '/' });
    });
  })(req, res, next);
});

//Triggers google request consuming the first parameter provided in the google strategy.
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }) //scope declaration as scpecified in google api
);

//User gets redirected to below link after successful login after which the second callback function
//in the google strategy gets triggered.
router.get(
  '/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_LINK + '/login',
  }),
  function (req, res) {
    // Successful authentication, redirect dashboard.
    if (req.user.password) return res.redirect(process.env.CLIENT_LINK + '/');
    res.redirect(process.env.CLIENT_LINK + '/user/createpassword');
  }
);

router.get('/logout', checkAuthenticated, function (req, res) {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: 'Internal Server Error' });
      return console.log(err);
    }
    req.session.destroy((err) => {
      if (err) console.log(`Error Destroying session: ${err}`);
    });
    res.redirect(process.env.CLIENT_LINK + '/');
  });
});
module.exports = router;
