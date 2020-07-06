const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/database')

// Load configuration
dotenv.config({ path: './.env' })

require('./config/passport')(passport)

connectDB()

// Initialize application
const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Handlebars helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require('./helpers/hbs')

// Handlebars configuration
app.engine(
  '.hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: { formatDate, truncate, stripTags, editIcon, select },
  })
)
app.set('view engine', '.hbs')

// Sessions
app.use(
  session({
    secret: 'storybooks secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Define global variable
app.use(function (request, response, next) {
  response.locals.user = request.user
  next()
})

// Static directory
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
