// controllers/homeController.js
const config = require('../config');
const JadwalModel = require('../models/jadwalModel');
const BiayaModel = require('../models/biayaModel');
const PengumumanModel = require('../models/pengumumanModel');
const prosedur = require('../utils/prosedur');
const kat = require('../utils/kategori');

// Terima objek Date (default driver pg) maupun string 'YYYY-MM-DD'
const tanggalID = (nilai) => {
  const d =
    nilai instanceof Date
      ? nilai
      : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Kolom NUMERIC dari pg datang sebagai string, jadi dikonversi dulu
const formatRupiah = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(nilai));

exports.index = async (req, res, next) => {
  try {
    const semua = await PengumumanModel.getAll();
    const pengumuman = semua
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} Informasi Layanan Puskesmas`,
      pengumuman,
    });
  } catch (error) {
    next(error);
  }
};

exports.informasi = async (req, res, next) => {
  try {
    const [jadwal, biaya] = await Promise.all([
      JadwalModel.getAll(),
      BiayaModel.getAll(),
    ]);
    res.render('informasi', {
      judul: `Informasi - ${config.appName}`,
      jadwal,
      biaya,
      prosedur,
      kat,
      formatRupiah,
      adminContact: config.adminContact || '',
    });
  } catch (error) {
    next(error);
  }
};

exports.medichat = (req, res) => {
  res.render('medichat', { judul: `${config.appName} Konsultasi` });
};