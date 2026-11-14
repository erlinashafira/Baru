// // Model admin: hanya butuh pencarian berdasarkan username
// const { Pool } = require('pg');

// // Asumsi: koneksi DB lewat DATABASE_URL (lihat bagian Asumsi)
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });



// // ini rev
// const pool = require('../config/database');

// // Ambil satu admin berdasarkan username, null jika tidak ada
// async function getByUsername(username) {
//   const /**result**/ { rows} = await pool.query(
//     'SELECT id, username, password_hash FROM admins WHERE username = $1 LIMIT 1',
//     [username]
//   );
//   // return result.rows[0] || null;
// }

// module.exports = { getByUsername };

const pool = require('../config/database');

// Ambil satu admin berdasarkan username, null jika tidak ada
async function getByUsername(username) {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1 LIMIT 1',
      [username]
    );
    return rows[0] || null;
  } catch (err) {
    // 👇 TAMBAHKAN BARIS INI UNTUK MELIHAT ERROR ASLI 👇
    console.error('🚨 ERROR DATABASE SAAT CARI ADMIN:', err.message);
    throw err; 
  }
}

module.exports = { getByUsername };