// Controller chat: meneruskan pesan ke Gemini dan membalas {reply}

const { askGemini } = require('../services/geminiService');
const { sendResponse } = require('../utils/response');

const GENERIC_ERROR =
  'Maaf, layanan chatbot sedang tidak tersedia. Silakan coba lagi beberapa saat lagi.';

// Sensor API key kalau tidak sengaja muncul di pesan error (untuk log saja)
function sanitizeForLog(text) {
  const key = process.env.GEMINI_API_KEY;
  let result = String(text);
  if (key) result = result.split(key).join('[DISEMBUNYIKAN]');
  return result;
}

async function chat(req, res) {
  try {
    // req.body.message sudah divalidasi & di-trim oleh validateChatInput
    const reply = await askGemini(req.body.message);

    if (typeof reply !== 'string' || reply.trim().length === 0) {
      throw new Error('Respons Gemini kosong');
    }

    return sendResponse(res, {
      code: 200,
      success: true,
      message: 'Berhasil',
      data: { reply },
    });
  } catch (err) {
    // Detail error hanya di log server, tidak dikirim ke klien
    console.error('[chatController] Gagal memproses chat:', sanitizeForLog(err && err.message));
    return sendResponse(res, {
      code: 500,
      success: false,
      message: GENERIC_ERROR,
      data: null,
    });
  }
}

module.exports = { chat };