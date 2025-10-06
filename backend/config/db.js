const mongoose = require('mongoose');


const mongoURI = 'mongodb+srv://nathanholtz:ABNYfatec@petconecta.aotiaz7.mongodb.net/?retryWrites=true&w=majority&appName=petconecta';

const connectDB = async () => {
  try {
    // Conecta ao MongoDB usando o mongoose
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado com sucesso ao MongoDB!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  }
};

// Exportamos a função para que ela possa ser usada em outros arquivos
module.exports = connectDB;