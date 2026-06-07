// Vercel Serverless Function Handler
require('dotenv').config();

const app = require('./src/index.js');

// Export the Express app for Vercel
module.exports = app;
