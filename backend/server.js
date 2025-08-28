// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const { ensureSuperAdmin } = require('./controllers/authController');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rotas
const escolaRoutes = require('./routes/escolaRoutes');
const userRoutes = require('./routes/userRoutes');   // ✅ corrigido
const matriculaRoutes = require('./routes/matriculaRoutes');
const mensalidadeRoutes = require('./routes/mensalidadeRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

app.use('/api/escolas', escolaRoutes);
app.use('/api/usuarios', userRoutes);   // ✅ corrigido
app.use('/api/matriculas', matriculaRoutes);
app.use('/api/mensalidades', mensalidadeRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Inicializa servidor
sequelize.sync().then(async () => {
  console.log('🎯 Banco de dados sincronizado!');
  await ensureSuperAdmin();
  app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));
});
