const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  precioOferta:{
    type: Number,
    min: 0,
    default: null
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  tallas: [{
    talla: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', 'único']
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  imagenes: [String],
  activo: {
    type: Boolean,
    default: true
  },
  destacado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

productoSchema.index({activo: 1, categoria: 1});
productoSchema.index({ destacado: 1, activo: 1 });
productoSchema.index({createdAt: -1});
module.exports = mongoose.model('Producto', productoSchema);