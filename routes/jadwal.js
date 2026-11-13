// Route jadwal: GET publik, tulis wajib admin
const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwalController');
const { requireAdminAuth } = require('../middlewares/auth');

router.get('/', jadwalController.getAll);
router.get('/:id', jadwalController.getById);
router.post('/', requireAdminAuth, jadwalController.create);
router.put('/:id', requireAdminAuth, jadwalController.update);
router.delete('/:id', requireAdminAuth, jadwalController.remove);

module.exports = router;