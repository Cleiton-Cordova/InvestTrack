// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Mount all grouped routes under /api
const routes = require('./routes');
app.use('/api', routes);

module.exports = app;
