const Producto = require('../models/Producto');
const cloudinary = require('../config/cloudinary');

// GET /api/productos — catálogo público
const getProductos = async (req, res) => {
  try {
    const { categoria, destacado, talla } = req.query;
    const filtro = { activo: true };

    if (categoria) filtro.categoria = categoria;
    if (destacado) filtro.destacado = true;
    if (talla) filtro.tallas = { $in: [talla] };

    const productos = await Producto.find(filtro)
      .populate('categoria', 'nombre slug')
      .sort({ createdAt: -1 });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// GET /api/productos/:id — detalle público
const getProducto = async (req, res) => {
  try {
    const producto = await Producto.findOne({ _id: req.params.id, activo: true })
      .populate('categoria', 'nombre slug');

    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// GET /api/admin/productos — todos (admin)
const getProductosAdmin = async (req, res) => {
  try {
    const productos = await Producto.find()
      .populate('categoria', 'nombre slug')
      .sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// POST /api/admin/productos — crear
const crearProducto = async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    await producto.populate('categoria', 'nombre slug');
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// PUT /api/admin/productos/:id — editar
const editarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoria', 'nombre slug');

    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar producto' });
  }
};

// DELETE /api/admin/productos/:id — eliminar
const eliminarProducto = async (req, res) => {
 try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    // Eliminar imágenes de Cloudinary
    if (producto.imagenes.length > 0) {
      const eliminaciones = producto.imagenes.map(url => {
        // Extraer el public_id de la URL
        // URL formato: https://res.cloudinary.com/cloud/image/upload/v123/hakai-tienda/nombre.webp
        const partes = url.split('/');
        const archivo = partes[partes.length - 1].split('.')[0];
        const carpeta = partes[partes.length - 2];
        const publicId = `${carpeta}/${archivo}`;
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(eliminaciones);
    }

    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto e imágenes eliminados' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  getProducto,
  getProductosAdmin,
  crearProducto,
  editarProducto,
  eliminarProducto
};