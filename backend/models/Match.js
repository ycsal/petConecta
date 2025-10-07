const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchSchema = new Schema({
  // Usando os nomes exatos da sua coleção
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id_pet: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  acao: {
    type: String,
    required: true,
    default: 'curtiu',
    enum: ['curtiu', 'descurtiu', 'superlike'] // Prepara para futuras ações
  },
  data_interacao: {
    type: Date,
    default: Date.now
  }
}, {
 
  collection: 'match'
});

// Garante que a combinação de usuário e pet seja única
MatchSchema.index({ id_usuario: 1, id_pet: 1 }, { unique: true });

module.exports = mongoose.model('Match', MatchSchema);