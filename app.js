const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const connectDB = require('./config/database');

// Load configuration
dotenv.config({path: './.env'});

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

// Static directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
