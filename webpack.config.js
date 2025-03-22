const path = require('path');

module.exports = {
    entry: {
        login: './public/login.js', 
    },
    output: {
        filename: '[name].bundle.js', // Output file: login.bundle.js
        path: path.resolve(__dirname, 'public/dist'), // Output directory (public/dist)
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
};