// server.js
require('dotenv').config();
const app = require('./app'); // ✅ importa app já configurado
const sequelize = require('./config/database');
require('./models/Asset');
require('./models/User');

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database connection error:', err);
});
