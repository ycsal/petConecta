const Servico = require('../models/Servico');

class ServicoController {
  static async createServico(req, res) {
    try {
      const {
        id_usuario,
        titulo,
        descricao,
        nomeUsuario,
        bairro,
        cidade,
        estado,
        valores,
        observacoesValores,
        status = 'Ativo'
      } = req.body;

      // Validar campos obrigatórios
      if (!id_usuario || !titulo || !descricao || !nomeUsuario) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios faltando'
        });
      }

      const newServico = new Servico({
        id_usuario,
        titulo,
        descricao,
        nomeUsuario,
        bairro,
        cidade,
        estado,
        valores,
        observacoesValores,
        status
      });

      await newServico.save();
      
      res.status(201).json({
        success: true,
        servico: newServico,
        message: 'Serviço cadastrado com sucesso'
      });
    } catch (err) {
      console.error('Erro ao criar serviço:', err);
      res.status(500).json({
        success: false,
        error: 'Erro no servidor ao criar serviço'
      });
    }
  }

  static async getMyServicos(req, res) {
    try {
      const { userId } = req.params;
      
      const servicos = await Servico.find({ id_usuario: userId });
      
      res.json({
        success: true,
        servicos
      });
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
      res.status(500).json({
        success: false,
        error: 'Erro no servidor ao buscar serviços'
      });
    }
  }
}

module.exports = ServicoController;