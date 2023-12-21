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
    email: req.user?.email,
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
    try {
      const targetUser = await USER.findById(req.params.id);
      const requestingUser = req.user; // User making the request

      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Logic for a super user
      if (requestingUser.userType === 'super') {
        if (targetUser._id.equals(requestingUser._id)) {
          // Super user can only change their own password
          if (req.body?.password) {
            const passwordHash = await bcrypt.hash(req.body.password, 10);
            await USER.findByIdAndUpdate(
              targetUser._id,
              { $set: { password: passwordHash } },
              { new: true }
            );
            return res
              .status(200)
              .json({ message: 'Password updated successfully' });
          }
          return res
            .status(403)
            .json({ message: 'You can only update your password' });
        } else {
          // Super user can update other users except for userType
          if (req.body?.userType && req.body.userType === 'super') {
            return res
              .status(403)
              .json({ message: 'Cannot assign super userType' });
          }
          const updates = { ...req.body };
          if (req.body?.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
          }
          const updatedUser = await USER.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
          );
          return res.json(updatedUser);
        }
      }

      // Logic for an admin user
      if (requestingUser.userType === 'admin') {
        if (
          targetUser._id.equals(requestingUser._id) ||
          ['normal', 'delivery'].includes(targetUser.userType)
        ) {
          // Admin updating themselves or normal/delivery users
          if (req.body.userType && req.body.userType !== targetUser.userType) {
            return res.status(403).json({ message: 'Cannot change userType' });
          }
          const updates = { ...req.body };
          if (req.body?.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
          }
          const updatedUser = await USER.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
          );
          return res.json(updatedUser);
        } else {
          return res.status(403).json({
            message:
              'Admin can only update their own or normal and delivery user types',
          });
        }
      }

      // Logic for normal and delivery users (self-update only)
      if (
        (requestingUser.userType === 'normal' ||
          requestingUser.userType === 'delivery') &&
        targetUser._id.equals(requestingUser._id)
      ) {
        // Allow updates on own profile
        const updates = { ...req.body };
        if (req.body?.password) {
          updates.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await USER.findByIdAndUpdate(
          req.params.id,
          { $set: updates },
          { new: true }
        );

        return res.json(updatedUser);
      }

      return res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
  .delete(async (req, res, next) => {
    const targetUserId = req.params.id;
    const requestingUser = req.user; // User making the request

    try {
      if (requestingUser.userType === 'super') {
        if (targetUserId === requestingUser._id.toString()) {
          return res
            .status(403)
            .json({ message: 'Super user cannot delete themselves' });
        }
        await USER.findByIdAndDelete(targetUserId);
        return res.status(200).json({ message: 'User deleted successfully' });
      }

      if (requestingUser.userType === 'admin') {
        const targetUser = await USER.findById(targetUserId);
        if (!targetUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (['normal', 'delivery'].includes(targetUser.userType)) {
          await USER.findByIdAndDelete(targetUserId);
          return res.status(200).json({ message: 'User deleted successfully' });
        } else {
          return res.status(403).json({
            message: 'Admin can only delete normal and delivery user types',
          });
        }
      }

      // Logic for normal and delivery users (self-delete only)
      if (
        (requestingUser.userType === 'normal' ||
          requestingUser.userType === 'delivery') &&
        targetUserId === requestingUser._id.toString()
      ) {
        await USER.findByIdAndDelete(targetUserId);
        return res.status(200).json({ message: 'User deleted successfully' });
      }

      return res.status(403).json({ message: 'Unauthorized' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

module.exports = router;
