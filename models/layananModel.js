// Model layanan/biaya (membaca tabel "biaya" sesuai kontrak)
const pool = require('../config/db');

const getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM biaya ORDER BY kategori ASC, id ASC');
  return rows;
};

const getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM biaya WHERE id = $1', [id]);
  return rows[0] || null;
};

const create = async ({ kategori, nama, tarif, umum, cito }) => {
  const { rows } = await pool.query(
    `INSERT INTO biaya (kategori, nama, tarif, umum, cito)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [kategori, nama, tarif, umum, cito]
  );
  return rows[0];
};

const update = async (id, { kategori, nama, tarif, umum, cito }) => {
  const { rows } = await pool.query(
    `UPDATE biaya
     SET kategori = $1, nama = $2, tarif = $3, umum = $4, cito = $5
     WHERE id = $6
     RETURNING *`,
    [kategori, nama, tarif, umum, cito, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rows } = await pool.query('DELETE FROM biaya WHERE id = $1 RETURNING *', [id]);
  return rows[0] || null;
};

module.exports = { getAll, getById, create, update, remove };