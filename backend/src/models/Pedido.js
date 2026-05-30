const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  productos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    nombre: String,
    talla: String,
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precio: Number
  }],
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'],
    default: 'pendiente'
  },
  instagramHandle: {
    type: String,
    trim: true
  },
  notas: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);