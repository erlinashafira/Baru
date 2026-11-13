// config/gemini.js
// Konfigurasi klien Google Gemini. API key hanya dibaca di server dari .env.
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Nama model dipusatkan di sini; ganti di satu tempat jika perlu.
const GEMINI_MODEL = 'gemini-2.5-flash';

// Batas waktu tunggu respons API (milidetik)
const GEMINI_TIMEOUT_MS = 20000;

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

let genAI = null;
if (!apiKey) {
  console.warn(
    '[gemini] PERINGATAN: GEMINI_API_KEY kosong. Chatbot tidak akan berfungsi sampai key diisi di file .env'
  );
} else {
  genAI = new GoogleGenerativeAI(apiKey);
}

module.exports = { genAI, GEMINI_MODEL, GEMINI_TIMEOUT_MS };