//importar model para interagir com o banco de dados
const Pet = require('../models/Pet');
const Match = require('../models/Match');

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

  static async createMatch(req, res) {
   //front envia userId e petId no corpo da requisição
    const { userId, petId } = req.body;

    try {
      // Verificamos a existência usando os nomes corretos do Schema
      const existingMatch = await Match.findOne({ id_usuario: userId, id_pet: petId });
      if (existingMatch) {
        return res.status(200).json({ message: 'Match já existe.' });
      }

      // Criamos o novo documento mapeando para os nomes corretos do Schema
      const newMatch = new Match({
        id_usuario: userId,
        id_pet: petId
        // Os campos 'acao' e 'data_interacao' usarão os valores padrão definidos no Model
      });
      await newMatch.save();

      console.log(`Match salvo: Usuário ${userId} deu match com Pet ${petId}`);
      res.status(201).json(newMatch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor ao salvar o match.');
    }
  }


  static async getMyMatches(req, res) {
    const { userId } = req.params;

    try {
      // 1. Encontra todos os matches daquele usuário, usando o campo 'id_usuario'
      const userMatches = await Match.find({ id_usuario: userId });

      // 2. Extrai apenas os IDs dos pets, usando o campo 'id_pet'
      const petIds = userMatches.map(match => match.id_pet);

      // 3. Busca no banco de dados todos os pets com base nos IDs extraídos
      const pets = await Pet.find({ '_id': { $in: petIds } });
      res.json(pets);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor ao buscar os matches.');
    }
  }
 
}

module.exports = PetController;