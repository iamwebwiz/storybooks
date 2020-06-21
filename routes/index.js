const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
  response.send('Login');
});

router.get('/dashboard', (request, response) => {
  response.send('Dashboard');
});

module.exports = router;
