const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

connectDB();

const app = express();
const PORT = 3001;
const HOST = '192.168.101.22'; // Seu IP local

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do PetConecta está no ar!');
});

app.use('/api/pets', require('./routes/pets'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/servicos', require('./routes/servicos'));

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor backend rodando em:`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌐 Rede: http://${HOST}:${PORT}`);
});