-- Hapus tabel produk lama (sisa project sebelumnya)
DROP TABLE IF EXISTS produk CASCADE;

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dokter_jadwal (
  id           SERIAL PRIMARY KEY,
  nama_dokter  VARCHAR(100) NOT NULL,
  layanan      VARCHAR(100) NOT NULL,
  hari         VARCHAR(10) NOT NULL,
  jam_mulai    TIME NOT NULL,
  jam_selesai  TIME NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'aktif',
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS layanan (
  id          SERIAL PRIMARY KEY,
  nama        VARCHAR(100) NOT NULL,
  deskripsi   TEXT,
  biaya       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);