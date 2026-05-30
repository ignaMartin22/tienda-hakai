const express = require('express');
const router = express.Router();
const { login, crearAdmin } = require('../controllers/authController');

router.post('/login', login);
router.post('/crear-admin', crearAdmin);

module.exports = router;