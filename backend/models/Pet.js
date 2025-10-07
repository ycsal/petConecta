const mongoose = require('mongoose');
const { Schema } = mongoose;

const PetSchema = new Schema({
  // 'ref' diz ao Mongoose que este campo se conecta ao futuro Model 'User'.
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  especie: {
    type: String,
    required: true
  },
  raca: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true,
    enum: ['M', 'F'] 
  },
  idade: {
    type: Number,
    required: true
  },
  porte: {
    type: String,
    required: true,
    enum: ['Pequeno', 'Médio', 'Grande'] 
  },
  status: {
    type: String,
    required: true,
    enum: ['Disponível', 'Adotado', 'Perdido'],
    default: 'Disponível' 
  },
  descricao: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    default: null 
    //deixei null pois fica mais facil na hora de criar, mas depois podemos colocar um require true e obrigar o usuario a colocar uma foto
  },
  data_registro: {
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('Pet', PetSchema);