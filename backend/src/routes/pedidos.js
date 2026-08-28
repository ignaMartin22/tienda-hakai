const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPedidos, actualizarEstado } = require('../controllers/pedidoController');

router.get('/', auth, getPedidos);
router.put('/:id', auth, actualizarEstado);

module.exports = router;