const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.render('login', {layout: 'auth'});
});

router.get('/dashboard', (request, response) => {
  response.render('dashboard');
});

module.exports = router;
