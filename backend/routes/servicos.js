const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/servicoController');

// Rota para criar serviço
router.post('/', ServicoController.createServico);

// Rota para buscar serviços do usuário
router.get('/meus/:userId', ServicoController.getMyServicos);

module.exports = router;