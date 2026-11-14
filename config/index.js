// Konfigurasi terpusat dari .env (hanya dibaca di server)
require('dotenv').config();
<<<<<<< HEAD
// ini rev
// Konfigurasi terpusat (hanya dibaca di server)
require('dotenv').config();
const path = require('path');

module.exports = {
  appName: 'MediChat',
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET,
  adminContact:
    process.env.ADMIN_CONTACT || 'Hubungi loket Puskesmas pada jam pelayanan',
  logDir: path.join(__dirname, '..', 'logs'),
  logFile: 'logger.md',
};

//ini yang lama
// module.exports = {
//   port: parseInt(process.env.PORT, 10) || 3000,
//   nodeEnv: process.env.NODE_ENV || 'development',
//   db: {
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT, 10) || 5432,
//     name: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//   },
//   sessionSecret: process.env.SESSION_SECRET,
//   geminiApiKey: process.env.GEMINI_API_KEY,
//   adminContact: process.env.ADMIN_CONTACT || '',
// };
=======

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  sessionSecret: process.env.SESSION_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  adminContact: process.env.ADMIN_CONTACT || '',
};
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
