const express = require('express');
const USER = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./auth-middleware');

router.post('/login', async (req, res, next) => {
  USER.findOne({ email: req.body.email }).then((user) => {
    if (user === null) {
      let err = new Error('User not found');
      err.status = 401;
      res.json({ status: false, message: 'User not found' });
      return next(err);
    }
    bcrypt.compare(req.body.password, user.password, function (err, status) {
      if (!status) {
        let err = new Error('Password does not match!');
        err.status = 401;
        res.json({ status: false, message: 'Password does not match!' });
        return next(err);
      }
      res.json({ status: true, message: 'Login Success' });
    });
  });
});
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
