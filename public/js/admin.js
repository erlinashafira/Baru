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