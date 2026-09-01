const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  activa: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

categoriaSchema.index({activo: 1});

module.exports = mongoose.model('Categoria', categoriaSchema);