// Entry point Medi-Chat
const config = require('./config'); // memuat dotenv
const path = require('path');
const express = require('express');
const session = require('express-session');
const pool = require('./config/database');

// Import yang dipakai
const routes = require('./routes');
const sendResponse = require('./utils/response');
const { formatRupiah } = require('./utils/format');
const logger = require('./middlewares/logger');

if (!config.sessionSecret) {
  console.error('SESSION_SECRET belum diisi di .env');
  process.exit(1);
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware dasar
app.locals.appName = config.appName;
app.locals.adminContact = config.adminContact;
app.locals.formatRupiah = formatRupiah;

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 jam
    },
  })
);

// Routes (Pakai routes gabungan yang baru)
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return sendResponse(res, { code: 404, success: false, message: 'Endpoint tidak ditemukan' });
  }
  res.status(404).send('Halaman tidak ditemukan');
});

// Error handler
app.use((err, req, res, next) => {
  const isJsonError = err.type === 'entity.parse.failed';
  const isTooLarge = err.type === 'entity.too.large';
  const code = isJsonError ? 400 : isTooLarge ? 413 : err.status || 500;

  if (code >= 500) console.error(err);

  const message = isJsonError
    ? 'Format JSON tidak valid'
    : isTooLarge
    ? 'Request terlalu besar'
    : code >= 500
    ? 'Terjadi kesalahan pada server'
    : err.message;

  if (req.originalUrl.startsWith('/api')) {
    return sendResponse(res, { code, success: false, message });
  }
  res.status(code).send(message);
});

// Cek koneksi DB sebelum listen
async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Koneksi database OK');
  } catch (err) {
    console.error('Gagal terhubung ke database:', err.message);
    process.exit(1);
  }
  app.listen(config.port, () => {
    console.log(`${config.appName} berjalan di http://localhost:${config.port}`);
  });
}

start();