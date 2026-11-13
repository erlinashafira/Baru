// Route layanan/biaya: GET publik, tulis wajib admin
// Dipasang di server.js sebagai app.use('/api/biaya', require('./routes/layanan'))
const express = require('express');
const router = express.Router();
const layananController = require('../controllers/layananController');
const { requireAdminAuth } = require('../middlewares/auth');

router.get('/', layananController.getAll);
router.get('/:id', layananController.getById);
router.post('/', requireAdminAuth, layananController.create);
router.put('/:id', requireAdminAuth, layananController.update);
router.delete('/:id', requireAdminAuth, layananController.remove);

module.exports = router;