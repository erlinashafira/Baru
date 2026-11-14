// Controller layanan/biaya: validasi input + format respons {success, message, data}
const layananModel = require('../models/layananModel');
const kategoriModul = require('../utils/kategori');

// Daftar kategori bisa berupa array atau object; dua-duanya ditangani
const KATEGORI_VALID = Array.isArray(kategoriModul)
  ? kategoriModul
  : Object.values(kategoriModul);

const respond = (res, code, success, message, data = null) =>
  res.status(code).json({ success, message, data });

const parseId = (raw) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Cek angka bulat >= 0 (string angka dari form juga diterima)
const angkaValid = (v) => {
  if (v === '' || v === null || v === undefined || typeof v === 'boolean') return false;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0;
};

const validasi = (body = {}) => {
  const errors = {};
  const value = {};

  if (!KATEGORI_VALID.includes(body.kategori)) {
    errors.kategori = 'kategori tidak valid';
  }
  value.kategori = body.kategori;

  value.nama = typeof body.nama === 'string' ? body.nama.trim() : '';
  if (!value.nama) errors.nama = 'nama wajib diisi';

  if (!angkaValid(body.tarif)) {
    errors.tarif = 'tarif wajib diisi berupa angka >= 0';
  } else {
    value.tarif = Number(body.tarif);
  }

  // umum dan cito opsional (NULL), tapi kalau diisi harus angka >= 0
  ['umum', 'cito'].forEach((f) => {
    const v = body[f];
    if (v === undefined || v === null || v === '') {
      value[f] = null;
    } else if (!angkaValid(v)) {
      errors[f] = `${f} harus berupa angka >= 0`;
    } else {
      value[f] = Number(v);
    }
  });

  return { errors, value };
};

const getAll = async (req, res) => {
  try {
    const data = await layananModel.getAll();
    return respond(res, 200, true, 'Data layanan berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const getById = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return respond(res, 400, false, 'ID tidak valid');
  try {
    const data = await layananModel.getById(id);
    if (!data) return respond(res, 404, false, 'Layanan tidak ditemukan');
    return respond(res, 200, true, 'Data layanan berhasil diambil', data);
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
    const data = await layananModel.create(value);
    return respond(res, 201, true, 'Layanan berhasil ditambahkan', data);
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
    const data = await layananModel.update(id, value);
    if (!data) return respond(res, 404, false, 'Layanan tidak ditemukan');
    return respond(res, 200, true, 'Layanan berhasil diperbarui', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

const remove = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) return respond(res, 400, false, 'ID tidak valid');
  try {
    const data = await layananModel.remove(id);
    if (!data) return respond(res, 404, false, 'Layanan tidak ditemukan');
    return respond(res, 200, true, 'Layanan berhasil dihapus', data);
  } catch (err) {
    console.error(err);
    return respond(res, 500, false, 'Terjadi kesalahan pada server');
  }
};

module.exports = { getAll, getById, create, update, remove };