const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const Story = require('../models/Story')

router.get('/', ensureGuest, (request, response) => {
  response.render('login', { layout: 'auth' })
})

router.get('/dashboard', ensureAuth, async (request, response) => {
  try {
    const stories = await Story.find({ user: request.user.id }).lean()

    response.render('dashboard', {
      name: request.user.firstName,
      stories,
    })
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

module.exports = router
