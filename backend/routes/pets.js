const express = require('express');
const router = express.Router();


const PetController = require('../controllers/petController');

// Rota para obter todos os pets
router.get('/', PetController.getAllPets);

//Rota para criar um match
router.post('/match', PetController.createMatch);

// Rota para buscar os matches de um usuário 
router.get('/mymatches/:userId', PetController.getMyMatches);

module.exports = router;