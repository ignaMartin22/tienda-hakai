const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 intentos
  message: { mensaje: 'Demasiados intentos, esperá 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false
})
require('dotenv').config();

const app = express();
app.use('/api/auth/login', loginLimiter);

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
app.get('/api/debug', (req, res) => {
res.json({
  mongoUri: process.env.MONGODB_URI ? 'definida' : 'no definida',
  nodeEnv: process.env.NODE_ENV,
  mongoState: mongoose.connection.readyState
});
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