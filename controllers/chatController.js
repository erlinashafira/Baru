// Controller chat: meneruskan pesan ke Gemini dan membalas {reply}

const { askGemini } = require('../services/geminiService');
<<<<<<< HEAD
//rev
const sendResponse = require('../utils/response');
// const { sendResponse } = require('../utils/response');
=======
const { sendResponse } = require('../utils/response');
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04

const GENERIC_ERROR =
  'Maaf, layanan chatbot sedang tidak tersedia. Silakan coba lagi beberapa saat lagi.';

<<<<<<< HEAD
//rev tambah
// Kode error dari geminiService yang pesannya aman ditampilkan ke pengunjung
const KODE_AMAN = new Set([
  'INVALID_INPUT', 'NO_KEY', 'TIMEOUT', 'QUOTA',
  'AUTH', 'BLOCKED', 'EMPTY', 'UNAVAILABLE',
]);

=======
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
// Sensor API key kalau tidak sengaja muncul di pesan error (untuk log saja)
function sanitizeForLog(text) {
  const key = process.env.GEMINI_API_KEY;
  let result = String(text);
  if (key) result = result.split(key).join('[DISEMBUNYIKAN]');
  return result;
}

async function chat(req, res) {
  try {
<<<<<<< HEAD

    //rev
        // req.body.message sudah divalidasi dan di-trim oleh validateChatInput
    const reply = await askGemini(req.body.message);

    return sendResponse(res, {
      message: 'Berhasil',
      data: { reply },
    });
    // // req.body.message sudah divalidasi & di-trim oleh validateChatInput
    // const reply = await askGemini(req.body.message);

    // if (typeof reply !== 'string' || reply.trim().length === 0) {
    //   throw new Error('Respons Gemini kosong');
    // }

    // return sendResponse(res, {
    //   code: 200,
    //   success: true,
    //   message: 'Berhasil',
    //   data: { reply },
    // });
      } catch (err) {
    console.error(
      '[chatController] Gagal memproses chat:',
      err && err.code ? err.code : '',
      sanitizeForLog(err && err.message)
    );

    const dikenal = err && KODE_AMAN.has(err.code);
    return sendResponse(res, {
      code: dikenal ? err.status : 502,
      success: false,
      message: dikenal ? err.message : GENERIC_ERROR,
    });
  }
  // } catch (err) {
  //   // Detail error hanya di log server, tidak dikirim ke klien
  //   console.error('[chatController] Gagal memproses chat:', sanitizeForLog(err && err.message));
  //   return sendResponse(res, {
  //     code: 500,
  //     success: false,
  //     message: GENERIC_ERROR,
  //     data: null,
  //   });
  // }
=======
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
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
}

module.exports = { chat };