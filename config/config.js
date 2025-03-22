const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.DBHOST,
    dialect: "postgres",
    logging: false,
    port: 5432,
    cookie: {
      httpOnly: true, // prevents js (client) to read it
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  },
  production: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.DBHOST,
    port: 5432,
    dialect: "postgres",
    ssl: 'require',
    cookie: {
      httpOnly: true,
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  },
  test: {
    username: process.env.TEST_DBUSER,
    password: process.env.TEST_DBPASSWORD,
    database: process.env.TEST_PGDATABASE,
    host: process.env.TEST_PGHOST,
    port: process.env.TEST_PGPORT,
    dialect: "postgres",
    logging: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false during test.
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  },
}

