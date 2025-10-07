//importar model para interagir com o banco de dados
const Pet = require('../models/Pet');


class PetController {

  static async getAllPets(req, res) {
    try {
      
      const pets = await Pet.find();
      
      res.json(pets);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }


  // static async getPetById(req, res) {
  //   // Lógica para buscar um pet por ID
  // }

  // static async createPet(req, res) {
  //   // Lógica para criar um novo pet
  // }

  // static async updatePet(req, res) {
  //   // Lógica para atualizar um pet
  // }

  // static async deletePet(req, res) {
  //   // Lógica para deletar um pet
  // }
}
//exporta a classe para ser usada em outros arquivos
module.exports = PetController;