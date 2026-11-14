// config/gemini.js
<<<<<<< HEAD
// Konfigurasi klien Google Gemini. API key hanya dibaca di server dari .env.
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Nama model dipusatkan di sini; ganti di satu tempat jika perlu.
const GEMINI_MODEL = 'gemini-2.5-flash';

// Batas waktu tunggu respons API (milidetik)
=======
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gunakan gemini-3.6-flash (atau gemini-3.8-flash) yang terbaru
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').trim();

>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
const GEMINI_TIMEOUT_MS = 20000;

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

let genAI = null;
if (!apiKey) {
<<<<<<< HEAD
  console.warn(
    '[gemini] PERINGATAN: GEMINI_API_KEY kosong. Chatbot tidak akan berfungsi sampai key diisi di file .env'
  );
=======
  console.warn('[gemini] PERINGATAN: GEMINI_API_KEY kosong.');
>>>>>>> 5c516b5cc1232c2af6bbf42858bc08b43c7820c5
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

module.exports = { genAI, GEMINI_MODEL, GEMINI_TIMEOUT_MS };