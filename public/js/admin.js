<<<<<<< HEAD
// Logika dashboard admin: tabel, modal tambah/edit/hapus, notifikasi
(function () {
  'use strict';

  var KATEGORI_VISITE = 'Visite & Konsultasi Rawat Inap';

  // Konfigurasi dua resource: jadwal dan biaya
  var CFG = {
    jadwal: {
      api: '/api/jadwal',
      tbody: document.getElementById('tbody-jadwal'),
      modal: document.getElementById('modal-jadwal'),
      form: document.getElementById('form-jadwal'),
      judul: document.getElementById('judul-jadwal'),
      namaTambah: 'Tambah Jadwal',
      namaEdit: 'Edit Jadwal',
      kolom: ['layanan', 'dokter', 'ruangan', 'hari', 'jam', 'status'],
      label: function (d) { return d.layanan + ' - ' + d.dokter; },
      data: []
    },
    biaya: {
      api: '/api/biaya',
      tbody: document.getElementById('tbody-biaya'),
      modal: document.getElementById('modal-biaya'),
      form: document.getElementById('form-biaya'),
      judul: document.getElementById('judul-biaya'),
      namaTambah: 'Tambah Layanan',
      namaEdit: 'Edit Layanan',
      kolom: ['kategori', 'nama', 'tarif', 'umum', 'cito'],
      label: function (d) { return d.nama; },
      data: []
    }
  };

  var notif = document.getElementById('notif');
  var notifTimer = null;
  var modalHapus = document.getElementById('modal-hapus');
  var hapusTarget = null; // { tipe, id }

  // ---------- Util ----------
  function tampilNotif(pesan, sukses) {
    notif.textContent = pesan;
    notif.className = 'alert ' + (sukses ? 'alert-success' : 'alert-danger');
    notif.hidden = false;
    clearTimeout(notifTimer);
    notifTimer = setTimeout(function () { notif.hidden = true; }, 5000);
  }

  function rupiah(n) {
    if (n === null || n === undefined) return '-';
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  }

  // Panggil API; sesi habis (401) diarahkan ke login
  async function api(url, opsi) {
    var res = await fetch(url, Object.assign({
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }
    }, opsi));
    if (res.status === 401) {
      window.location.href = '/admin/login';
      throw new Error('Sesi berakhir');
    }
    var json = null;
    try { json = await res.json(); } catch (e) { /* respons bukan JSON */ }
    return { ok: res.ok, status: res.status, json: json || { success: false, message: 'Respons server tidak valid' } };
  }

  function td(teks) {
    var el = document.createElement('td');
    el.textContent = teks; // textContent: aman dari XSS
    return el;
  }

  function tombol(teks, kelas, handler) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + kelas;
    b.textContent = teks;
    b.addEventListener('click', handler);
    return b;
  }

  // ---------- Render tabel ----------
  function render(tipe) {
    var c = CFG[tipe];
    c.tbody.innerHTML = '';
    if (!c.data.length) {
      var tr0 = document.createElement('tr');
      var tdKosong = td('Belum ada data');
      tdKosong.colSpan = c.kolom.length + 2;
      tr0.appendChild(tdKosong);
      c.tbody.appendChild(tr0);
      return;
    }
    c.data.forEach(function (d, i) {
      var tr = document.createElement('tr');
      tr.appendChild(td(i + 1));
      c.kolom.forEach(function (k) {
        var v = d[k];
        if (tipe === 'biaya' && (k === 'tarif' || k === 'umum' || k === 'cito')) v = rupiah(v);
        tr.appendChild(td(v === null || v === undefined ? '-' : v));
      });
      var aksi = document.createElement('td');
      aksi.appendChild(tombol('Edit', 'btn-sm', function () { bukaForm(tipe, d); }));
      aksi.appendChild(tombol('Hapus', 'btn-sm btn-danger', function () { bukaHapus(tipe, d); }));
      tr.appendChild(aksi);
      c.tbody.appendChild(tr);
    });
  }

  async function muat(tipe) {
    try {
      var r = await api(CFG[tipe].api);
      if (r.ok && r.json.success) {
        CFG[tipe].data = r.json.data || [];
        render(tipe);
      } else {
        tampilNotif(r.json.message || 'Gagal memuat data', false);
      }
    } catch (e) {
      if (e.message !== 'Sesi berakhir') tampilNotif('Gagal terhubung ke server', false);
    }
  }

  // ---------- Form tambah/edit ----------
  function bersihkanError(form) {
    form.querySelectorAll('[data-error]').forEach(function (el) { el.textContent = ''; });
  }

  function tampilError(form, errors) {
    bersihkanError(form);
    if (!errors || typeof errors !== 'object') return;
    Object.keys(errors).forEach(function (k) {
      var el = form.querySelector('[data-error="' + k + '"]');
      if (el) el.textContent = errors[k];
    });
  }

  // Tampilkan grup umum/cito hanya untuk kategori Visite
  function aturGrupVisite() {
    var sel = document.getElementById('b-kategori');
    var visite = sel.value === KATEGORI_VISITE;
    document.getElementById('grup-visite').hidden = !visite;
    document.getElementById('label-tarif').textContent = visite ? 'Tarif dr. Spesialis (Rp)' : 'Tarif (Rp)';
    if (!visite) {
      document.getElementById('b-umum').value = '';
      document.getElementById('b-cito').value = '';
    }
  }

  function bukaForm(tipe, data) {
    var c = CFG[tipe];
    c.form.reset();
    bersihkanError(c.form);
    c.form.elements.id.value = data ? data.id : '';
    c.judul.textContent = data ? c.namaEdit : c.namaTambah;
    if (data) {
      c.kolom.forEach(function (k) {
        var field = c.form.elements[k];
        if (field) field.value = data[k] === null || data[k] === undefined ? '' : data[k];
      });
    }
    if (tipe === 'biaya') aturGrupVisite();
    c.modal.showModal();
  }

  async function simpan(tipe, e) {
    e.preventDefault();
    var c = CFG[tipe];
    var id = c.form.elements.id.value;
    var body = {};
    c.kolom.forEach(function (k) { body[k] = c.form.elements[k].value; });

    try {
      var r = await api(id ? c.api + '/' + id : c.api, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      });
      if (r.ok && r.json.success) {
        c.modal.close();
        tampilNotif(r.json.message, true);
        muat(tipe);
      } else {
        tampilError(c.form, r.json.data); // pesan validasi dari API
        tampilNotif(r.json.message || 'Gagal menyimpan data', false);
      }
    } catch (err) {
      if (err.message !== 'Sesi berakhir') tampilNotif('Gagal terhubung ke server', false);
    }
  }

  // ---------- Hapus ----------
  function bukaHapus(tipe, data) {
    hapusTarget = { tipe: tipe, id: data.id };
    document.getElementById('teks-hapus').textContent =
      'Yakin ingin menghapus "' + CFG[tipe].label(data) + '"? Tindakan ini tidak bisa dibatalkan.';
    modalHapus.showModal();
  }

  async function konfirmasiHapus() {
    if (!hapusTarget) return;
    var t = hapusTarget;
    hapusTarget = null;
    try {
      var r = await api(CFG[t.tipe].api + '/' + t.id, { method: 'DELETE' });
      modalHapus.close();
      tampilNotif(r.json.message || (r.ok ? 'Data dihapus' : 'Gagal menghapus data'), r.ok && r.json.success);
      if (r.ok) muat(t.tipe);
    } catch (err) {
      modalHapus.close();
      if (err.message !== 'Sesi berakhir') tampilNotif('Gagal terhubung ke server', false);
    }
  }

  // ---------- Tab ----------
  function pilihTab(tipe) {
    document.getElementById('section-jadwal').hidden = tipe !== 'jadwal';
    document.getElementById('section-biaya').hidden = tipe !== 'biaya';
    document.getElementById('tab-jadwal').classList.toggle('btn-primary', tipe === 'jadwal');
    document.getElementById('tab-biaya').classList.toggle('btn-primary', tipe === 'biaya');
  }

  // ---------- Event ----------
  document.getElementById('tab-jadwal').addEventListener('click', function () { pilihTab('jadwal'); });
  document.getElementById('tab-biaya').addEventListener('click', function () { pilihTab('biaya'); });
  document.getElementById('btn-tambah-jadwal').addEventListener('click', function () { bukaForm('jadwal', null); });
  document.getElementById('btn-tambah-biaya').addEventListener('click', function () { bukaForm('biaya', null); });
  CFG.jadwal.form.addEventListener('submit', function (e) { simpan('jadwal', e); });
  CFG.biaya.form.addEventListener('submit', function (e) { simpan('biaya', e); });
  document.getElementById('b-kategori').addEventListener('change', aturGrupVisite);
  document.getElementById('btn-konfirmasi-hapus').addEventListener('click', konfirmasiHapus);

  // Semua tombol "Batal" menutup dialog induknya
  document.querySelectorAll('[data-tutup]').forEach(function (b) {
    b.addEventListener('click', function () { b.closest('dialog').close(); });
  });

  muat('jadwal');
  muat('biaya');
})();
=======
//ini rev
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);

const RJ = 'Pemeriksaan & Konsultasi Rawat Jalan';
const VISITE = 'Visite & Konsultasi Rawat Inap';
const AKOMODASI = 'Akomodasi Rawat Inap';
const KATEGORI = [RJ, VISITE, AKOMODASI];
const STATUS = ['Tersedia', 'Penuh', 'Libur'];

const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Senin - Sabtu', 'Senin - Jumat', 'Senin - Kamis'];

// Daftar Tindakan sesuai Kategori
const TINDAKAN = {
  [RJ]: [
    'Pemeriksaan Dokter Spesialis',
    'Pemeriksaan Dokter Umum',
    'Pemeriksaan Dokter Gigi',
    'Konsultasi Gizi',
    'Asesmen Keperawatan',
    'Tindakan Medis Ringan'
  ],
  [VISITE]: [
    'Kelas I', 'Kelas II', 'Kelas III', 'VIP', 'ICU/NICU', 'Isolasi / Intermediet'
  ],
  [AKOMODASI]: [
    'Kelas I', 'Kelas II', 'Kelas III', 'VIP', 'ICU/NICU', 'One Day Care'
  ]
};

const rupiah = (n) =>
  n === null || n === undefined || n === ''
    ? ''
    : new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(n);

const config = {
  jadwal: {
    api: '/api/jadwal',
    judul: 'Jadwal Layanan',
    desk: 'Kelola jadwal dokter umum, dokter gigi, dan imunisasi.',
    fields: [
      { key: 'layanan', label: 'Layanan', type: 'text', placeholder: 'Contoh: Dokter Umum', max: 100 },
      { key: 'dokter', label: 'Nama Dokter', type: 'text', placeholder: 'Contoh: dr. Andi Pratama', max: 100 },
      { key: 'ruangan', label: 'Ruangan', type: 'text', placeholder: 'Contoh: Poli Umum', max: 100 },
      { key: 'hari', label: 'Hari', type: 'select', options: HARI },
      { key: 'jam', label: 'Jam', type: 'text', placeholder: 'Contoh: 08.00 - 12.00', max: 50 },
      { key: 'status', label: 'Status', type: 'select', options: STATUS },
    ],
  },
  biaya: {
    api: '/api/biaya',
    judul: 'Biaya Pengobatan',
    desk: 'Kelola tarif rawat jalan dan rawat inap.',
    fields: [
      { key: 'kategori', label: 'Kategori', type: 'select', options: KATEGORI },
      { key: 'nama', label: 'Tindakan / Kelas', type: 'dynamic-select', options: TINDAKAN },
      { key: 'tarif', label: 'Tarif (Visite: dr. Spesialis)', type: 'number', rupiah: true },
      { key: 'umum', label: 'Tarif dr. Umum', type: 'number', rupiah: true, only: VISITE },
      { key: 'cito', label: 'Cito/Libur dr. Spesialis', type: 'number', rupiah: true, only: VISITE },
    ],
  },
  pengumuman: {
    api: '/api/pengumuman',
    judul: 'Informasi Puskesmas',
    desk: 'Kelola info terbaru Puskesmas.',
    fields: [
      { key: 'judul', label: 'Judul', type: 'text', placeholder: 'Contoh: Imunisasi Anak', max: 150 },
      { key: 'tanggal', label: 'Tanggal', type: 'date' },
      { key: 'isi', label: 'Isi Pengumuman', type: 'textarea', placeholder: 'Tulis detail informasi...' },
    ],
  },
};

const data = { jadwal: [], biaya: [], pengumuman: [] };
let tab = 'jadwal';
let editId = null;

// ---------- API ----------
async function api(method, url, body) {
  const opsi = { method, headers: {} };
  if (body !== undefined) {
    opsi.headers['Content-Type'] = 'application/json';
    opsi.body = JSON.stringify(body);
  }

  const res = await fetch(url, opsi);
  let hasil = {};
  try {
    hasil = await res.json();
  } catch (_) {
    /* respons bukan JSON */
  }

  if (res.status === 401) {
    location.href = '/admin/login'; // sesi habis
    throw new Error('Sesi habis, silakan login lagi');
  }
  if (!res.ok || !hasil.success) {
    throw new Error(hasil.message || 'Terjadi kesalahan pada server');
  }
  return hasil.data;
}

async function muat(kunci) {
  data[kunci] = (await api('GET', config[kunci].api)) || [];
}

const muatSemua = () => Promise.all(Object.keys(config).map(muat));

// ---------- Tampilan ----------
function render() {
  const c = config[tab];
  $('judul').textContent = c.judul;
  $('deskripsi').textContent = c.desk;

  // Kartu statistik
  const stats = $('stats');
  stats.replaceChildren();
  Object.keys(config).forEach((k) => {
    const card = el('div', { className: 'stat' + (k === tab ? ' aktif' : '') });
    card.append(
      el('span', { className: 'stat-angka', textContent: data[k].length }),
      el('span', { className: 'stat-label', textContent: config[k].judul })
    );
    stats.append(card);
  });

  // Header tabel
  const trh = el('tr');
  c.fields.forEach((f) => trh.append(el('th', { textContent: f.label })));
  trh.append(el('th', { textContent: 'Aksi' }));
  $('thead').replaceChildren(trh);

  // Isi tabel
  const rows = data[tab].map((item) => {
    const tr = el('tr');
    c.fields.forEach((f) => {
      const mentah = item[f.key];
      const val = f.rupiah ? rupiah(mentah) : mentah ?? '';
      const td = el('td', { textContent: val || '-' });
      if (!val) td.classList.add('kosong');
      td.dataset.label = f.label; // dipakai CSS saat tabel jadi kartu di mobile
      tr.append(td);
    });

    const aksi = el('td', { className: 'aksi' });
    const ubah = el('button', { type: 'button', className: 'btn-sm ubah', textContent: 'Ubah' });
    const hapus = el('button', { type: 'button', className: 'btn-sm hapus', textContent: 'Hapus' });
    ubah.addEventListener('click', () => bukaForm(item.id));
    hapus.addEventListener('click', () => hapusData(item.id));
    aksi.append(ubah, hapus);

    tr.append(aksi);
    return tr;
  });

  $('tbody').replaceChildren(...rows);
  $('empty').hidden = rows.length > 0;
}

// ---------- Form tambah / ubah ----------
function bukaForm(id = null) {
  editId = id;
  const c = config[tab];
  const item = id ? data[tab].find((d) => d.id === id) || {} : {};

  $('dlg-title').textContent = (id ? 'Ubah ' : 'Tambah ') + c.judul;
  $('form-error').hidden = true;

  const wrap = $('fields');
  wrap.replaceChildren();

  c.fields.forEach((f) => {
    const box = el('div', { className: 'field' });
    const lab = el('label', { htmlFor: 'f-' + f.key, textContent: f.label });

    let input;
    if (f.type === 'select') {
      input = el('select');
      f.options.forEach((o) => input.append(new Option(o, o)));
    } else if (f.type === 'dynamic-select') {
      input = el('select');
      const katTerpilih = $('f-kategori') ? $('f-kategori').value : KATEGORI[0];
      const opsiTindakan = f.options[katTerpilih] || [];
      opsiTindakan.forEach((o) => input.append(new Option(o, o)));
    } else if (f.type === 'textarea') {
      input = el('textarea', { rows: 3 });
      if (f.placeholder) input.placeholder = f.placeholder;
    } else if (f.type === 'number') {
      input = el('input', { type: 'number', min: 0, step: 1 });
    } else if (f.type === 'date') {
      // Validasi Tanggal: Min hari ini, Max 6 bulan ke depan
      input = el('input', { type: 'date' });
      const hariIni = new Date();
      const formatHariIni = hariIni.toISOString().split('T')[0];
      
      const enamBulanKemudian = new Date();
      enamBulanKemudian.setMonth(enamBulanKemudian.getMonth() + 6);
      const formatMaksimal = enamBulanKemudian.toISOString().split('T')[0];

      input.min = formatHariIni;
      input.max = formatMaksimal;
      
      if (!item[f.key]) {
          input.value = formatHariIni; // Default isi dengan hari ini
      }
    } else {
      input = el('input', { type: f.type });
      if (f.placeholder) input.placeholder = f.placeholder;
      if (f.max) input.maxLength = f.max;
    }

    input.id = 'f-' + f.key;
    input.required = true;
    if (item[f.key] !== undefined && item[f.key] !== null) input.value = item[f.key];

    box.append(lab, input);
    wrap.append(box);
  });

  // Kolom Visite (dr. Umum, Cito) hanya muncul kalau kategori = Visite
  const kat = $('f-kategori');
  const atur = () =>
    c.fields.forEach((f) => {
      if (!f.only) return;
      const tampil = kat.value === f.only;
      const n = $('f-' + f.key);
      n.closest('.field').style.display = tampil ? '' : 'none';
      n.required = tampil;
    });
    
  if (kat) {
    kat.addEventListener('change', atur);
    atur();
    
    if (tab === 'biaya') {
      kat.addEventListener('change', () => {
        const selectTindakan = $('f-nama');
        selectTindakan.innerHTML = ''; 
        const opsiBaru = TINDAKAN[kat.value] || [];
        opsiBaru.forEach((o) => selectTindakan.append(new Option(o, o)));
      });
    }
  }

  $('dlg').showModal();
}

async function hapusData(id) {
  if (!confirm('Hapus data ini?')) return;
  try {
    await api('DELETE', `${config[tab].api}/${id}`);
    await muat(tab);
    render();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Event ----------
document.querySelectorAll('.tab').forEach((b) => {
  b.addEventListener('click', () => {
    tab = b.dataset.tab;
    document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === b));
    render();
  });
});

$('btn-tambah').addEventListener('click', () => bukaForm());
$('batal').addEventListener('click', () => $('dlg').close());

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const c = config[tab];

  const baru = {};
  c.fields.forEach((f) => {
    const n = $('f-' + f.key);
    baru[f.key] = n.closest('.field').style.display === 'none' ? '' : n.value.trim();
  });

  $('simpan').disabled = true;
  $('form-error').hidden = true;

  try {
    if (editId) await api('PUT', `${c.api}/${editId}`, baru);
    else await api('POST', c.api, baru);

    await muat(tab);
    render();
    $('dlg').close();
  } catch (err) {
    $('form-error').textContent = err.message;
    $('form-error').hidden = false;
  } finally {
    $('simpan').disabled = false;
  }
});

// Keluar (sidebar desktop dan top bar mobile)
document.querySelectorAll('.js-logout').forEach((b) => {
  b.addEventListener('click', async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      location.href = '/admin/login';
    }
  });
});

muatSemua()
  .then(render)
  .catch((err) => {
    render();
    $('empty').textContent = err.message;
    $('empty').hidden = false;
  });
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
