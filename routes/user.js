const express = require('express');
const USER = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { checkAuthenticated } = require('./auth-middleware');

// Route to check authentication status
router.get('/status', checkAuthenticated, (req, res) => {
  // Return information about the authenticated user
  res.status(200).json({
    success: true,
    message: req.user?.email,
    passwordExist: req.user.password ? true : false,
  });
});

router.post('/createpassword', checkAuthenticated, async (req, res, next) => {
  //check first if the sent passwords match or not.
  if (req.body.password !== req.body.repassword)
    return res.status(400).json({
      message: 'The new password and confirmation password do not match.',
    });

  //hash the password
  bcrypt.hash(req.body.password, 10, async function (err, hash) {
    if (err) throw new Error('Could not encrypt password!');
    try {
      const body = { email: req.user.email, password: hash };

      //put the password inside already created user.
      await USER.findByIdAndUpdate({ _id: req.user._id }, body, {
        new: true,
      }).then((response) => {
        return res
          .status(200)
          .json({ user: response, message: 'Password was created' });
      });
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
      return res.status(200).json({ success: true, message: req.user?.email });
    });
  })(req, res, next);
});

//Triggers google request consuming the first parameter provided in the google strategy.
router.get(
  '/auth/google',
  (req, res, next) => {
    next();
  },
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

router.delete('/logout', checkAuthenticated, function (req, res) {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: 'Internal Server Error' });
      return console.log(err);
    }
    req.session.destroy((err) => {
      if (err) console.log(`Error Destroying session: ${err}`);
    });
    res.status(200).json({ success: true, message: 'Logout successful' });
  });
});
router.get('/all', async function (req, res) {
  try {
    const response = await USER.find({});
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/delete/all', async function (req, res, next) {
  try {
    const response = await USER.deleteMany({});
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});
router.delete('/delete/:id', async function (req, res, next) {
  const id = req.params.id;
  try {
    const response = await USER.findByIdAndDelete(id);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
