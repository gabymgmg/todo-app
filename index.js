const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv = require('dotenv').config();
const config = require('./config/config');
const cookieParser = require('cookie-parser');
const path = require('path')
const publicDir = path.join(__dirname, '/public')
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const taskRoutes = require('./routes/tasks');
const indexRoutes = require('./routes/index');
const passport = require('passport')
const session = require('express-session');
const { init: initAuth } = require('./passport');

// constant to use express methods and middlewares
const app = express();
// passport
initAuth();
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
// converts request body to JSON, form-data to JSON etc.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// static folders location
app.use(express.static(publicDir));
app.use(cookieParser(process.env.COOKIE_SECRET)); // Set cookie secret

// viewing engine has to be set to use pug
app.set("view engine", "pug");

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', taskRoutes);
app.use('/', indexRoutes);

// database
let db;
if (process.env.NODE_ENV === 'test') {
    db = require('./models/index.mock');
  } else {
    db = require('./models/index');
  }
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced successfully.');
        // Start your application
    })
    .catch(error => {
        console.error('Error syncing database:', error);
    })
    .then(() => {
        app.listen(process.env.PORT, console.log('Server is running on port: ' + process.env.PORT));
    });

module.exports = app

