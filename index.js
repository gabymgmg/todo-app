const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv = require('dotenv').config();
const path = require('path')
const publicDir = path.join(__dirname, '../public')
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const db = require('./models/index');
// constant to use express methods and middlewares
const app = express();

// converts request body to JSON, form-data to JSON etc.
app.use(bodyParser.urlencoded({ extended: true }));

// static folders location
app.use(express.static(publicDir));

// viewing engine has to be set to use pug
app.set("view engine", "pug");

app.use('/', authRoutes);
app.use('/', dashboardRoutes);

// database
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


