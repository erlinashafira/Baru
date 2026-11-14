<!-- ini rev
ini file baru -->
# Medi-Chat

Website informasi layanan Puskesmas + chatbot AI (Gemini) + panel admin.
Stack: Node.js, Express 4, EJS, PostgreSQL (pg), CSS sendiri.

## Instalasi
1. Node.js 18+ dan PostgreSQL terpasang.
2. Buat database: `createdb medichat`
3. `npm install`
4. `cp .env.example .env` lalu isi DB_*, SESSION_SECRET, GEMINI_API_KEY, ADMIN_CONTACT, SEED_ADMIN_PASSWORD
5. `npm run seed`
6. `npm start`, buka http://localhost:3000

## Catatan
- Jangan commit `.env`. API key hanya dibaca di server.
- Login admin: username `admin`, password sesuai SEED_ADMIN_PASSWORD (halaman /admin/login).