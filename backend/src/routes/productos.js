const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProductos,
  getProducto,
  getProductosAdmin,
  crearProducto,
  editarProducto,
  eliminarProducto
} = require('../controllers/productoController');

// Públicas
router.get('/', getProductos);
router.get('/:id', getProducto);

// Admin
router.get('/admin/todos', auth, getProductosAdmin);
router.post('/admin', auth, crearProducto);
router.put('/admin/:id', auth, editarProducto);
router.delete('/admin/:id', auth, eliminarProducto);

module.exports = router;

