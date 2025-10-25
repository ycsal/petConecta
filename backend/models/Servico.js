const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServicoSchema = new Schema({
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  nomeUsuario: {
    type: String,
    required: true
  },
  bairro: String,
  cidade: String,
  estado: String,
  valores: String,
  observacoesValores: String,
  status: {
    type: String,
    enum: ['Ativo', 'Inativo', 'Pausado'],
    default: 'Ativo'
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Servico', ServicoSchema);