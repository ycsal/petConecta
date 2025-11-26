const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Rota para registrar usuário
router.post('/register', AuthController.register);

// Rota para login
router.post('/login', AuthController.login);

// Rota para obter perfil do usuário
router.get('/profile/:userId', AuthController.getProfile);

module.exports = router;