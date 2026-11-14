// controllers/homeController.js
const config = require('../config');
const JadwalModel = require('../models/jadwalModel');
const BiayaModel = require('../models/biayaModel');
const PengumumanModel = require('../models/pengumumanModel');
const prosedur = require('../utils/prosedur');
const kat = require('../utils/kategori');

<<<<<<< HEAD
// Terima objek Date (default driver pg) maupun string 'YYYY-MM-DD'
const tanggalID = (nilai) => {
  const d =
    nilai instanceof Date
      ? nilai
      : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);
=======
// Terima objek Date maupun string 'YYYY-MM-DD'
const keDate = (nilai) =>
  nilai instanceof Date
    ? nilai
    : new Date(`${String(nilai).slice(0, 10)}T00:00:00`);

const tanggalID = (nilai) => {
  const d = keDate(nilai);
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
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
<<<<<<< HEAD
    const pengumuman = semua
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} Informasi Layanan Puskesmas`,
      pengumuman,
=======
    // Terbaru dulu, ambil 3 teratas
    const pengumuman = [...semua]
      .sort((a, b) => keDate(b.tanggal) - keDate(a.tanggal))
      .slice(0, 3)
      .map((p) => ({ ...p, tanggalTampil: tanggalID(p.tanggal) }));
    res.render('index', {
      judul: `${config.appName} - Informasi Layanan Puskesmas`,
      pengumuman,
      isAdmin: req.session && req.session.adminId ? true : false,
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
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
<<<<<<< HEAD
=======
       isAdmin: req.session && req.session.adminId ? true : false,
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
    });
  } catch (error) {
    next(error);
  }
};

exports.medichat = (req, res) => {
<<<<<<< HEAD
  res.render('medichat', { judul: `${config.appName} Konsultasi` });
=======
  res.render('medichat', { 
    judul: `Konsultasi - ${config.appName}`,
    isAdmin: req.session && req.session.adminId ? true : false,
    waAdmin: process.env.WHATSAPP_ADMIN || '' 
   });
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
};