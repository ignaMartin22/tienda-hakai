const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');

// Generar slug automáticamente
const generarSlug = (nombre) => {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

// GET /api/categorias — todas las activas (público)
const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ activa: true }).sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};

// GET /api/admin/categorias — todas (admin)
const getCategoriasAdmin = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};

// POST /api/admin/categorias — crear
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const slug = generarSlug(nombre);

    const existe = await Categoria.findOne({ slug });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }

    const categoria = new Categoria({ nombre, slug, descripcion });
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
};

// PUT /api/admin/categorias/:id — editar
const editarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, activa } = req.body;
    const slug = nombre ? generarSlug(nombre) : undefined;

    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, slug, descripcion, activa },
      { new: true, runValidators: true }
    );

    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar categoría' });
  }
};

// DELETE /api/admin/categorias/:id — eliminar
const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

    // Desasignar la categoría de todos los productos que la tenían
    await Producto.updateMany(
      { categoria: req.params.id },
      { $unset: { categoria: '' } }
    );

    res.json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};

module.exports = {
  getCategorias,
  getCategoriasAdmin,
  crearCategoria,
  editarCategoria,
  eliminarCategoria
};