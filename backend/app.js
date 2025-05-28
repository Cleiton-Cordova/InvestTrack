const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors()); // This line enables cross-origin requests
app.use(express.json());
app.use('/api', routes);

module.exports = app;
