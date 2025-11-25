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
        telefone,
        valores,
        observacoesValores,
        status = 'Ativo'
      } = req.body;

      // Validar campos obrigatórios
      if (!id_usuario || !titulo || !descricao || !nomeUsuario || !telefone) {
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
        telefone,
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

  static async updateServico(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const servico = await Servico.findByIdAndUpdate(id, updateData, { new: true });

      if (!servico) {
        return res.status(404).json({ success: false, error: 'Serviço não encontrado' });
      }

      res.json({ success: true, servico, message: 'Serviço atualizado com sucesso' });
    } catch (err) {
      console.error('Erro ao atualizar serviço:', err);
      res.status(500).json({ success: false, error: 'Erro ao atualizar serviço' });
    }
  }

  static async deleteServico(req, res) {
    const { id } = req.params;

    try {
      const servico = await Servico.findByIdAndDelete(id);

      if (!servico) {
        return res.status(404).json({ success: false, error: 'Serviço não encontrado' });
      }

      res.json({ success: true, message: 'Serviço excluído com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar serviço:', err);
      res.status(500).json({ success: false, error: 'Erro ao deletar serviço' });
    }
  }
  static async getAllServicos(req, res) {
    try {
      const { search, cidade, estado } = req.query;
      
      // Filtro base - apenas serviços ativos
      const filter = { status: 'Ativo' };

      // Adicionar filtros opcionais
      if (search) {
        filter.$or = [
          { titulo: { $regex: search, $options: 'i' } },
          { descricao: { $regex: search, $options: 'i' } },
          { nomeUsuario: { $regex: search, $options: 'i' } },
          { bairro: { $regex: search, $options: 'i' } }
        ];
      }

      if (cidade) filter.cidade = { $regex: cidade, $options: 'i' };
      if (estado) filter.estado = { $regex: estado, $options: 'i' };

      const servicos = await Servico.find(filter).sort({ createdAt: -1 });
      
      res.json({
        success: true,
        servicos,
        total: servicos.length
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