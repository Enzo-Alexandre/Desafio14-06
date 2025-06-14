require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const pontoRoutes = require('./routes/ponto');

// Importar models para que o Sequelize os conheça e possa criar as tabelas
require('./models/funcionario');
require('./models/registroPonto');

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que o servidor entenda JSON

// Define as rotas principais da API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ponto', pontoRoutes);

const PORT = process.env.PORT || 5000;

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Não foi possível conectar ao banco de dados:', err);
});