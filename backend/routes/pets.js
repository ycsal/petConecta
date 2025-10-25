const express = require('express');
const router = express.Router();
const PetController = require('../controllers/petController');

// Rota para obter todos os pets
router.get('/', PetController.getAllPets);

// Rota para obter um pet específico pelo ID
router.get('/:id', PetController.getPetById);

//Rota para criar um match
router.post('/match', PetController.createMatch);

// Rota para buscar os matches de um usuário 
router.get('/mymatches/:userId', PetController.getMyMatches);

// Rota para obter pets do usuário específico
router.get('/meus/:userId', PetController.getMyPets);

// Rota para criar um novo pet
router.post('/', PetController.createPet);

module.exports = router;