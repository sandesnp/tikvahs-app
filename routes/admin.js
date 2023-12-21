const express = require('express');
const router = express.Router();
const Auth = require('./auth-middleware');
const path = require('path');

router.get('/*', Auth.checkAdmin, function (req, res) {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});

module.exports = router;
