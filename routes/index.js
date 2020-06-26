const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middlewares/auth');

router.get('/', ensureGuest, (request, response) => {
  response.render('login', { layout: 'auth' });
});

router.get('/dashboard', ensureAuth, (request, response) => {
  response.render('dashboard');
});

module.exports = router;
