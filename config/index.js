// Konfigurasi terpusat dari .env (hanya dibaca di server)
require('dotenv').config();
<<<<<<< HEAD

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
=======
const path = require('path');

module.exports = {
  appName: 'MediChat',
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET,
  adminContact:
    process.env.ADMIN_CONTACT || 'Hubungi loket Puskesmas pada jam pelayanan',
  
  // Konfigurasi Database
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
<<<<<<< HEAD
  sessionSecret: process.env.SESSION_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  adminContact: process.env.ADMIN_CONTACT || '',
=======
  
  // Konfigurasi API Key & Log
  geminiApiKey: process.env.GEMINI_API_KEY,
  logDir: path.join(__dirname, '..', 'logs'),
  logFile: 'logger.md',
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
};