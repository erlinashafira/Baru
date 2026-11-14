<<<<<<< HEAD
=======
// controllers/homeController.js
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
const config = require('../config');
const JadwalModel = require('../models/jadwalModel');
const BiayaModel = require('../models/biayaModel');
const PengumumanModel = require('../models/pengumumanModel');
const prosedur = require('../utils/prosedur');
const kat = require('../utils/kategori');

<<<<<<< HEAD

//rev
// Terima objek Date maupun string 'YYYY-MM-DD'
const keDate = (nilai) =>
  nilai instanceof Date
    ? nilai
    : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);

const tanggalID = (nilai) => {
  const d = keDate(nilai);
=======
// Terima objek Date (default driver pg) maupun string 'YYYY-MM-DD'
const tanggalID = (nilai) => {
  const d =
    nilai instanceof Date
      ? nilai
      : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
<<<<<<< HEAD
// Terima objek Date (default driver pg) maupun string 'YYYY-MM-DD'
// const tanggalID = (nilai) => {
//   const d =
//     nilai instanceof Date
//       ? nilai
//       : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);
//   if (Number.isNaN(d.getTime())) return '-';
//   return d.toLocaleDateString('id-ID', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric',
//   });
// };


=======

// Kolom NUMERIC dari pg datang sebagai string, jadi dikonversi dulu
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
const formatRupiah = (nilai) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(nilai));

<<<<<<< HEAD

//rev
exports.index = async (req, res, next) => {
  try {
    const semua = await PengumumanModel.getAll();
    // Terbaru dulu, ambil 3 teratas
    const pengumuman = [...semua]
      .sort((a, b) => keDate(b.tanggal) - keDate(a.tanggal))
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} - Informasi Layanan Puskesmas`,
=======
exports.index = async (req, res, next) => {
  try {
    const semua = await PengumumanModel.getAll();
    const pengumuman = semua
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} Informasi Layanan Puskesmas`,
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
      pengumuman,
    });
  } catch (error) {
    next(error);
  }
};
<<<<<<< HEAD
// exports.index = async (req, res, next) => {
//   try {
//     const semua = await PengumumanModel.getAll();
//     const pengumuman = semua
//       .slice(0, 3)
//       .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
//     res.render('index', {
//       judul: `${config.appName} Informasi Layanan Puskesmas`,
//       pengumuman,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
=======
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04

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

<<<<<<< HEAD

//rev
exports.medichat = (req, res) => {
  res.render('medichat', { judul: `Konsultasi - ${config.appName}` });
};
// exports.medichat = (req, res) => {
//   res.render('medichat', { judul: `${config.appName} Konsultasi` });
// };
=======
exports.medichat = (req, res) => {
  res.render('medichat', { judul: `${config.appName} Konsultasi` });
};
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
