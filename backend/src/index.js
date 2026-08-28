const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/imagenes', require('./routes/imagenes'));
app.use('/api/pedidos', require('./routes/pedidos'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Backend funcionando 🚀' });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err.message));

// Exportar para Vercel y también escuchar localmente
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 3000}`);
  });
}

module.exports = app;