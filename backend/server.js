const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // 1. IMPORTAMOS nossa função de conexão

// 2. CHAMAMOS a função para conectar ao banco de dados
connectDB();

// Configurações iniciais do servidor
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('API do PetConecta está no ar!');
});

// --- Os Models e as Rotas da API virão aqui no próximo passo ---

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});