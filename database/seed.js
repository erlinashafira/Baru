// Seed data awal. Aman dijalankan berulang (tidak membuat duplikat).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Data layanan (GANTI dengan data lama jika berbeda)
const layananData = [
  ['Pemeriksaan Umum', 'Pemeriksaan kesehatan umum oleh dokter', 10000],
  ['Pemeriksaan Gigi dan Mulut', 'Pemeriksaan dan perawatan dasar gigi', 25000],
  ['Kesehatan Ibu dan Anak', 'Pemeriksaan kehamilan dan tumbuh kembang anak', 15000],
  ['Imunisasi', 'Imunisasi dasar untuk bayi dan anak', 20000],
  ['Keluarga Berencana', 'Konsultasi dan layanan KB', 15000],
  ['Laboratorium Dasar', 'Pemeriksaan darah dan urine dasar', 30000],
  ['Cek Gula Darah', 'Pemeriksaan kadar gula darah', 15000],
  ['Cek Tekanan Darah', 'Pengukuran tensi dan konsultasi singkat', 5000],
  ['Konsultasi Gizi', 'Konsultasi pola makan dan status gizi', 10000],
  ['Konseling Kesehatan Jiwa', 'Konseling dasar kesehatan mental', 10000],
  ['Layanan Lansia', 'Pemeriksaan rutin dan senam lansia', 5000],
  ['Tindakan Medis Ringan', 'Perawatan luka dan tindakan ringan', 35000],
];

// [nama_dokter, layanan, hari, jam_mulai, jam_selesai, status]
const jadwalData = [
  ['dr. Andi Pratama', 'Pemeriksaan Umum', 'Senin', '08:00', '12:00', 'aktif'],
  ['drg. Sari Wulandari', 'Pemeriksaan Gigi dan Mulut', 'Selasa', '08:00', '12:00', 'aktif'],
  ['dr. Budi Santoso', 'Pemeriksaan Umum', 'Rabu', '08:00', '14:00', 'aktif'],
  ['dr. Maya Lestari', 'Kesehatan Ibu dan Anak', 'Kamis', '08:00', '12:00', 'aktif'],
  ['dr. Rizki Hidayat', 'Pemeriksaan Umum', 'Jumat', '08:00', '11:00', 'aktif'],
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Terapkan schema dulu
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);

    // Admin (lewati jika username sudah ada)
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await client.query(
      `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2) ON CONFLICT (username) DO NOTHING`,
      ['admin', hash]
    );

    // Layanan (lewati jika nama sudah ada)
    for (const [nama, deskripsi, biaya] of layananData) {
      await client.query(
        `INSERT INTO layanan (nama, deskripsi, biaya)
         SELECT $1::varchar, $2::text, $3::integer
         WHERE NOT EXISTS (SELECT 1 FROM layanan WHERE nama = $1::varchar)`,
        [nama, deskripsi, biaya]
      );
    }

    // Jadwal (lewati jika dokter + hari + jam mulai sudah ada)
    for (const [dokter, layanan, hari, mulai, selesai, status] of jadwalData) {
      await client.query(
        `INSERT INTO dokter_jadwal (nama_dokter, layanan, hari, jam_mulai, jam_selesai, status)
         SELECT $1::varchar, $2::varchar, $3::varchar, $4::time, $5::time, $6::varchar
         WHERE NOT EXISTS (
           SELECT 1 FROM dokter_jadwal
           WHERE nama_dokter = $1::varchar AND hari = $3::varchar AND jam_mulai = $4::time
         )`,
        [dokter, layanan, hari, mulai, selesai, status]
      );
    }

    await client.query('COMMIT');
    console.log('Seed selesai.');
    if (!process.env.SEED_ADMIN_PASSWORD) {
      console.warn('PERINGATAN: SEED_ADMIN_PASSWORD kosong, memakai password default. Ganti segera.');
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

seed()
  .catch((err) => {
    console.error('Seed gagal:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());