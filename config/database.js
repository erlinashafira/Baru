<<<<<<< HEAD
//rev dari repo asli
const { Pool } = require('pg');

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

module.exports = pool;

// // Koneksi PostgreSQL bersama (sementara, ganti jika tim sudah punya)
// const { Pool } = require('pg');

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// module.exports = pool;
=======
// Koneksi PostgreSQL bersama (sementara, ganti jika tim sudah punya)
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
