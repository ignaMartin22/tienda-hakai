const Pedido = require('../models/Pedido');

// GET /api/admin/pedidos
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('productos.productoId', 'nombre imagenes')
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

// PUT /api/admin/pedidos/:id
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar pedido' });
  }
};

module.exports = { getPedidos, actualizarEstado };