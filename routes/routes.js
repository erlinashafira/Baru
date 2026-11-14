<<<<<<< HEAD
// // Route chat: POST /api/chat (di-mount di server.js dengan prefix /api/chat)

// const express = require('express');
// const validateChatInput = require('../middlewares/validateChatInput');
// const chatController = require('../controllers/chatController');

// const router = express.Router();

// router.post('/', validateChatInput, chatController.chat);

// module.exports = router;
=======
// Route chat: POST /api/chat (di-mount di server.js dengan prefix /api/chat)

const express = require('express');
const validateChatInput = require('../middlewares/validateChatInput');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/', validateChatInput, chatController.chat);

module.exports = router;
>>>>>>> 1c16585e22c0336d2320f8943d6bdff4c1209f04
