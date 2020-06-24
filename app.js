const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/database');

// Load configuration
dotenv.config({ path: './.env' });

require('./config/passport')(passport);

connectDB();

// Initialize application
const app = express();

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars configuration
app.engine(
  '.hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'main',
  })
);
app.set('view engine', '.hbs');

// Sessions
app.use(
  session({
    secret: 'storybooks secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
