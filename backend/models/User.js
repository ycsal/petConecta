const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true
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
    bairro: String,
    cidade: String,
    estado: String
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  },
  ultimo_login: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);