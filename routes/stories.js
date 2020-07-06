const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middlewares/auth')
const Story = require('../models/Story')

router.get('/add', ensureAuth, (request, response) => {
  response.render('stories/add')
})

router.post('/', ensureAuth, async (request, response) => {
  try {
    request.body.user = request.user.id
    await Story.create(request.body)
    response.redirect('/dashboard')
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

module.exports = router
