const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getCategorias,
  getCategoriasAdmin,
  crearCategoria,
  editarCategoria,
  eliminarCategoria
} = require('../controllers/categoriaController');

// Públicas
router.get('/', getCategorias);

// Admin (protegidas)
router.get('/admin', auth, getCategoriasAdmin);
router.post('/admin', auth, crearCategoria);
router.put('/admin/:id', auth, editarCategoria);
router.delete('/admin/:id', auth, eliminarCategoria);

module.exports = router;