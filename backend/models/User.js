const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  sobrenome: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    trim: true
  },
  endereco: {
    cep: String,
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String
  },
  tipoUsuario: {
  type: String,
  enum: ['Adotante', 'Protetor', 'Abrigo', 'Outro'],
  required: true
},
  data_cadastro: {
    type: Date,
    default: Date.now
  }/*,
  ultimo_login: {
    type: Date
  }*/
});

module.exports = mongoose.model('User', UserSchema);