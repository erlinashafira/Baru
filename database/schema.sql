-- Hapus tabel produk lama (sisa project sebelumnya)
<<<<<<< HEAD
-- DROP TABLE IF EXISTS produk CASCADE;

--ini rev
-- tabel dari versi lama, sudah tidak dipakai
DROP TABLE IF EXISTS produk;
DROP TABLE IF EXISTS dokter_jadwal;
DROP TABLE IF EXISTS layanan;

=======
DROP TABLE IF EXISTS produk CASCADE;
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
<<<<<<< HEAD
  --ini rev yg pass dan create
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jadwal (
  id           SERIAL PRIMARY KEY,
  -- nama_dokter  VARCHAR(100) NOT NULL,
  layanan      VARCHAR(100) NOT NULL,
  --ini rev
  dokter VARCHAR(100) NOT NULL,
  ruangan VARCHAR(100) NOT NULL,

  hari         VARCHAR(10) NOT NULL,
  jam VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Tersedia'
    CHECK (status IN ('Tersedia', 'Penuh', 'Libur')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

  -- jam_mulai    TIME NOT NULL,
  -- jam_selesai  TIME NOT NULL,
  -- status       VARCHAR(20) NOT NULL DEFAULT 'aktif',
  -- created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  -- updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);


--ini rev tambahan
CREATE TABLE IF NOT EXISTS biaya (
    id SERIAL PRIMARY KEY,
    kategori VARCHAR(100) NOT NULL,
    nama VARCHAR(150) NOT NULL,
    tarif INTEGER NOT NULL CHECK (tarif >= 0),
    umum INTEGER CHECK (umum >= 0),
    cito INTEGER CHECK (cito >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pengumuman (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(150) NOT NULL,
    tanggal DATE NOT NULL,
    isi TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admins (username, password_hash)
VALUES (
  'admin',
  '$2b$10$v7otfWeItzbnYf2AK5UhRef6GtQwypPakr/I2M8Shco7etvCpaxFi'
);

-- CREATE TABLE IF NOT EXISTS layanan (
--   id          SERIAL PRIMARY KEY,
--   nama        VARCHAR(100) NOT NULL,
--   deskripsi   TEXT,
--   biaya       INTEGER NOT NULL DEFAULT 0,
--   created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
--   updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
-- );
=======
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
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
