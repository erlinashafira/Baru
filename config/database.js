<<<<<<< HEAD
// Koneksi PostgreSQL bersama (sementara, ganti jika tim sudah punya)
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
=======
// config/database.js
//rev dari repo asli
const { Pool } = require('pg');
// Memuat dotenv agar process.env terbaca
require('dotenv').config(); 

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'medichat_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
    console.error('PostgreSQL Error:', err.message);
});
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5

module.exports = pool;