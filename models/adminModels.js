// Model admin: hanya butuh pencarian berdasarkan username
const { Pool } = require('pg');

// Asumsi: koneksi DB lewat DATABASE_URL (lihat bagian Asumsi)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Ambil satu admin berdasarkan username, null jika tidak ada
async function getByUsername(username) {
  const result = await pool.query(
    'SELECT id, username, password_hash FROM admins WHERE username = $1 LIMIT 1',
    [username]
  );
  return result.rows[0] || null;
}

module.exports = { getByUsername };