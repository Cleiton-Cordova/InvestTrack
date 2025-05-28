// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const sequelize = require('./config/database');
require('./models/Asset');
require('./models/User'); // ✅ important: load User model

const routes = require('./routes'); // ✅ loads both assets + auth routes

app.use(cors());
app.use(express.json());

// Mount all routes under /api (e.g. /api/register, /api/assets)
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database connection error:', err);
});
