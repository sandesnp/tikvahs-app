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
    _id: req.user._id,
    message: req.user?.email,
    passwordExist: req.user.password ? true : false,
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

router
  .route('/')
  .get(async function (req, res) {
    try {
      const response = await USER.find({});
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  })
  .delete(async function (req, res, next) {
    try {
      const response = await USER.deleteMany({});
      res.json(response);
    } catch (err) {
      console.log(err);
    }
  });

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

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      const user = await USER.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  .put(async (req, res) => {
    try {
      const updatedUser = await USER.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  .patch(async (req, res) => {
    console.log(1, req.params.id);
    const newUpdates = { ...req.body };
    if (req.body?.password) {
      try {
        newUpdates.password = await bcrypt.hash(req.body.password, 10);
      } catch (err) {
        throw new Error('Could not encrypt password!');
      }
    }
    try {
      const updatedUser = await USER.findByIdAndUpdate(
        req.params.id,
        { $set: newUpdates },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  .delete(async function (req, res, next) {
    const id = req.params.id;
    try {
      const response = await USER.findByIdAndDelete(id);
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
