const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  }
});

router.post('/', auth, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ mensaje: 'No se envió ninguna imagen' });

    const resultado = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'hakai-tienda', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.json({ url: resultado.secure_url });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al subir imagen' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    const { url } = req.body;
    const partes = url.split('/');
    const archivo = partes[partes.length - 1].split('.')[0];
    const carpeta = partes[partes.length - 2];
    const publicId = `${carpeta}/${archivo}`;

    await cloudinary.uploader.destroy(publicId);
    res.json({ mensaje: 'Imagen eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar imagen' });
  }
});

module.exports = router;