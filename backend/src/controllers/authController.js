const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValida = await admin.verificarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, email: admin.email });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login' });
  }
};

// POST /api/auth/crear-admin (solo usar una vez para crear el admin)
const crearAdmin = async (req, res) => {
  try {
    const existe = await Admin.findOne();
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un admin' });
    }

    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = new Admin({ email, passwordHash });
    await admin.save();

    res.status(201).json({ mensaje: 'Admin creado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear admin' });
  }
};

module.exports = { login, crearAdmin };