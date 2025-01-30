const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: false,
    port: 5433,
    cookie: {
      httpOnly: true, // prevents js (client) to read it
      secure: false, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: 5433,
    dialect: "postgres",
    ssl: 'require',
    cookie: {
      httpOnly: true,
      secure: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }
  }
}

