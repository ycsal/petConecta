const mongoose = require('mongoose');
const { Schema } = mongoose;

const enderecoSchema = new mongoose.Schema({
  cep: { type: String, required: true },
  rua: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true }
});

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
    enderecoSchema,
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