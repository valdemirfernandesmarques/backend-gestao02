require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Models e Associações
require('./models/Associacoes');

// Controllers
const { ensureSuperAdmin } = require('./controllers/authController');

// Rotas
const authRoutes = require('./routes/authRoutes');
const escolaRoutes = require('./routes/escolaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const modalidadeRoutes = require('./routes/modalidadeRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const matriculaRoutes = require('./routes/matriculaRoutes');
const mensalidadeRoutes = require('./routes/mensalidadeRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/modalidades', modalidadeRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/matriculas', matriculaRoutes);
app.use('/api/mensalidades', mensalidadeRoutes);
app.use('/api/pagamentos', pagamentoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) // garante ajustes sem destruir dados
  .then(async () => {
    console.log('✅ Conexão com MySQL estabelecida com sucesso.');

    // Garante SUPER_ADMIN criado
    await ensureSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao sincronizar o banco:', err);
  });
