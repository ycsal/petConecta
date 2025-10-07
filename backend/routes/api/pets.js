const express = require('express');
const router = express.Router();


const PetController = require('../../controllers/petController');

// Rota para obter todos os pets
router.get('/', PetController.getAllPets);

module.exports = router;