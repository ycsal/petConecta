const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

connectDB();


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('API do PetConecta está no ar!');
});
app.use('/api/pets', require('./routes/pets'));


app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
});