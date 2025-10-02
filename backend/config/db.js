const mongoose = require('mongoose');

// Pegue sua String de Conexão no site do MongoDB Atlas
// DICA: Em "Network Access" no Atlas, libere o acesso de qualquer IP (0.0.0.0/0) para os testes.
const mongoURI = 'mongodb+srv://nathanholtz:ABNYfatec@petconecta.aotiaz7.mongodb.net/?retryWrites=true&w=majority&appName=petconecta';

const connectDB = async () => {
  try {
    // Tenta conectar ao banco de dados
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado com sucesso ao MongoDB!');
  } catch (err) {
    // Se der erro, exibe o erro e encerra o processo do servidor
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Encerra a aplicação com um código de falha
  }
};

// Exportamos a função para que ela possa ser usada em outros arquivos
module.exports = connectDB;