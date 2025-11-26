const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/servicoController');

// Rota para criar serviço
router.post('/', ServicoController.createServico);

// Rota para buscar serviços do usuário
router.get('/meus/:userId', ServicoController.getMyServicos);

router.get('/', ServicoController.getAllServicos);

// Rota para atualizar serviço
router.patch('/:id', ServicoController.updateServico);

// Rota para deletar serviço
router.delete('/:id', ServicoController.deleteServico); 


module.exports = router;