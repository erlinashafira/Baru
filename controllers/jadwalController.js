<<<<<<< HEAD
// Controller jadwal: validasi input + format respons {success, message, data}
const jadwalModel = require('../models/jadwalModel');

const STATUS_VALID = ['Tersedia', 'Penuh', 'Libur'];

const respond = (res, code, success, message, data = null) =>
  res.status(code).json({ success, message, data });

const parseId = (raw) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Ubah "HH:MM" jadi menit; null kalau format salah
const toMenit = (s) => {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(s);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

// Validasi body; kembalikan { errors, value }
const validasi = (body = {}) => {
  const errors = {};
  const value = {};

  ['layanan', 'dokter', 'ruangan', 'hari', 'jam'].forEach((f) => {
    const v = typeof body[f] === 'string' ? body[f].trim() : '';
    if (!v) errors[f] = `${f} wajib diisi`;
    value[f] = v;
  });

  if (!STATUS_VALID.includes(body.status)) {
    errors.status = `status harus salah satu dari: ${STATUS_VALID.join(', ')}`;
  }
  value.status = body.status;

  // Kolom jam bertipe TEXT, formatnya "HH:MM - HH:MM"
  if (!errors.jam) {
    const parts = value.jam.split(/\s*-\s*/);
    const mulai = parts.length === 2 ? toMenit(parts[0]) : null;
    const selesai = parts.length === 2 ? toMenit(parts[1]) : null;
    if (mulai === null || selesai === null) {
      errors.jam = 'jam harus berformat "HH:MM - HH:MM"';
    } else if (mulai >= selesai) {
      errors.jam = 'jam mulai harus lebih kecil dari jam selesai';
    }
  }

  return { errors, value };
};

const getAll = async (req, res) => {
  try {
    const data = await jadwalModel.getAll();
    return respond(res, 200, true, 'Data jadwal berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const getById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return respond(res, 400, false, 'ID tidak valid');
  try {
    const data = await jadwalModel.getById(id);
    if (!data) return respond(res, 404, false, 'Jadwal tidak ditemukan');
    return respond(res, 200, true, 'Data jadwal berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const create = async (req, res) => {
  const { errors, value } = validasi(req.body);
  if (Object.keys(errors).length) {
    return respond(res, 400, false, 'Validasi gagal', errors);
  }
  try {
    const data = await jadwalModel.create(value);
    return respond(res, 201, true, 'Jadwal berhasil ditambahkan', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const update = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return respond(res, 400, false, 'ID tidak valid');
  const { errors, value } = validasi(req.body);
  if (Object.keys(errors).length) {
    return respond(res, 400, false, 'Validasi gagal', errors);
  }
  try {
    const data = await jadwalModel.update(id, value);
    if (!data) return respond(res, 404, false, 'Jadwal tidak ditemukan');
    return respond(res, 200, true, 'Jadwal berhasil diperbarui', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const remove = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return respond(res, 400, false, 'ID tidak valid');
  try {
    const data = await jadwalModel.remove(id);
    if (!data) return respond(res, 404, false, 'Jadwal tidak ditemukan');
    return respond(res, 200, true, 'Jadwal berhasil dihapus', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

module.exports = { getAll, getById, create, update, remove };
=======
//ini rev
const model = require('../models/jadwalModel');
const makeController = require('../utils/makeController');

// "08.00" atau "08:00" menjadi menit; null kalau format salah
const toMenit = (s) => {
  const m = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/.exec(s);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

// Format jam: "08.00 - 12.00"
const cekJam = (v) => {
  const p = v.split(/\s*-\s*/);
  const a = p.length === 2 ? toMenit(p[0]) : null;
  const b = p.length === 2 ? toMenit(p[1]) : null;
  if (a === null || b === null) return 'Jam harus berformat "08.00 - 12.00"';
  if (a >= b) return 'Jam mulai harus lebih awal dari jam selesai';
  return null;
};

module.exports = makeController({
  model,
  label: 'jadwal',
  fields: [
    { key: 'layanan', label: 'Layanan', type: 'text', max: 100 },
    { key: 'dokter', label: 'Nama dokter', type: 'text', max: 100 },
    { key: 'ruangan', label: 'Ruangan', type: 'text', max: 100 },
    { key: 'hari', label: 'Hari', type: 'text', max: 50 },
    { key: 'jam', label: 'Jam', type: 'text', max: 50, check: cekJam },
    {
      key: 'status',
      label: 'Status',
      type: 'enum',
      options: ['Tersedia', 'Penuh', 'Libur'],
      default: 'Tersedia',
    },
  ],
});
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
