const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middlewares/auth')
const Story = require('../models/Story')

router.get('/', ensureAuth, async (request, response) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    response.render('stories/index', { stories })
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

router.get('/:id', ensureAuth, async (request, response) => {
  try {
    let story = await Story.findById(request.params.id).populate('user').lean()

    if (!story) {
      return response.render('errors/404')
    }

    response.render('stories/show', { story })
  } catch (error) {
    console.error(error)
    response.render('errors/404')
  }
})

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

router.get('/edit/:id', ensureAuth, async (request, response) => {
  try {
    const story = await Story.findOne({ _id: request.params.id }).lean()

    if (!story) {
      return response.render('errors/404')
    }

    if (story.user != request.user.id) {
      response.redirect('/stories')
    } else {
      response.render('stories/edit', { story })
    }
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

router.put('/:id', ensureAuth, async (request, response) => {
  try {
    let story = await Story.findById(request.params.id).lean()

    if (!story) {
      return response.render('render/404')
    }

    if (story.user != request.user.id) {
      response.redirect('/stories')
    } else {
      story = await Story.findByIdAndUpdate(
        { _id: request.params.id },
        request.body,
        {
          new: true,
          runValidators: true,
        }
      )

      response.redirect('/dashboard')
    }
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

router.delete('/:id', ensureAuth, async (request, response) => {
  try {
    await Story.remove({ _id: request.params.id })
    response.redirect('/dashboard')
  } catch (error) {
    console.error(error)
    response.render('errors/500')
  }
})

module.exports = router
