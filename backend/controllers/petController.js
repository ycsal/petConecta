//importar model para interagir com o banco de dados
const Pet = require('../models/Pet');
const Match = require('../models/Match');
const User = require('../models/User');

class PetController {

  static async getAllPets(req, res) {
  try {
    
    const { sexo, porte, castrado, vacinado, status } = req.query;  

      const filterQuery = {};
     
      if (status) {
        
        filterQuery.status = status;
      } else {
        
        filterQuery.status = { $in: ['Disponível', 'Perdido'] };
      }
      
    if (sexo) filterQuery.sexo = sexo;
    if (porte) filterQuery.porte = porte;
    if (castrado) filterQuery.castrado = castrado === 'true';
    if (vacinado) filterQuery.vacinado = vacinado === 'true';

    const pets = await Pet.find(filterQuery);
    
    res.json(pets);
  } catch (err) {
    console.error(err.message);
  }
}
  static async getPetById(req, res) {
    try {
      const petId = req.params.id; // Pega o ID da URL (ex: /api/pets/12345)
      
      // Busca o pet pelo ID E popula os dados do usuário referenciado ('nome' e 'telefone')
      const pet = await Pet.findById(petId).populate('id_usuario', 'nome telefone');

      // Verifica se o pet foi encontrado
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
      }

      // Se encontrado, retorna os dados do pet (com usuário populado)
      res.json(pet);

    } catch (err) {
      // Trata erro caso o ID seja inválido (formato ObjectId incorreto)
      if (err.kind === 'ObjectId') {
         return res.status(404).json({ message: 'ID do Pet inválido.' });
      }
      // Outros erros genéricos do servidor
      console.error(err.message);
      res.status(500).send('Erro no Servidor ao buscar o pet.');
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
  static async getMyPets(req, res) {
    try {
      const { userId } = req.params;

      // Busca todos os pets onde o id_usuario é o userId
      const pets = await Pet.find({ id_usuario: userId });

      res.json(pets);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor ao buscar pets do usuário');
    }
    

    
  }
static async createPet(req, res) {
  try {
    const {
      id_usuario,
      nome,
      especie,
      raca,
      sexo,
      idade,
      porte,
      status = 'Disponível',
      descricao,
      foto,
      castrado = false,
      vacinado = false
    } = req.body;

    // Valida se o Usuario esta logado
    if (!id_usuario) {
      return res.status(400).json({ 
        success: false,
        error: 'ID do usuário é obrigatório' 
      });
    }

    // Valida se o usuario existe
    const userExists = await User.findById(id_usuario);
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado' 
      });
    }

    // Validar campos obrigatórios
    if (!nome || !especie || !raca || !sexo || !idade || !porte) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Criar novo pet
    const newPet = new Pet({
      id_usuario,
      nome,
      especie,
      raca,
      sexo,
      idade: parseInt(idade),
      porte,
      status,
      descricao,
      foto,
      castrado: Boolean(castrado),
      vacinado: Boolean(vacinado)
    });

    await newPet.save();
    console.log(`Pet "${nome}" criado com sucesso para usuário ${id_usuario}`);
    res.status(201).json(newPet);
    }catch (err) {
      console.error('Erro ao criar pet:', err.message);
      res.status(500).send('Erro no Servidor ao criar pet');
    }
  }

  static async updatePet(req, res) {
    const { id } = req.params; // Pega o ID que veio na URL
    const updateData = req.body; // Pega os dados novos

    try {
      // findByIdAndUpdate: Busca pelo ID e atualiza com os dados novos
      // { new: true }: Retorna o pet já atualizado
      // { runValidators: true }: Garante que as regras (como enum 'M'/'F') sejam respeitadas
      const pet = await Pet.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
      }

      res.json(pet);
    } catch (err) {
      console.error('Erro ao atualizar:', err.message);
      res.status(500).json({ message: 'Erro ao atualizar pet', error: err.message });
    }
  }
  static async deletePet(req, res) {
    const { id } = req.params;

    try {
      const pet = await Pet.findByIdAndDelete(id);

      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado.' });
      }

      res.json({ message: 'Pet excluído com sucesso!' });
    } catch (err) {
      console.error('Erro ao deletar:', err.message);
      res.status(500).json({ message: 'Erro ao deletar pet', error: err.message });
    }
  }

  static async deleteMatch(req, res) {
    const { petId, userId } = req.params;

    try {
      // Remove o documento da coleção 'Match' onde o usuário e o pet combinam
      const deletedMatch = await Match.findOneAndDelete({ 
        id_usuario: userId, 
        id_pet: petId 
      });

      if (!deletedMatch) {
        return res.status(404).json({ message: 'Match não encontrado.' });
      }

      res.json({ message: 'Match desfeito com sucesso.' });
    } catch (err) {
      console.error('Erro ao deletar match:', err.message);
      res.status(500).json({ message: 'Erro ao desfazer match', error: err.message });
    }
  }

}

module.exports = PetController;
