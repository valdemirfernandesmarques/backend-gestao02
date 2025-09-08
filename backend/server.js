// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// ================================
// Middlewares
// ================================
app.use(cors());
app.use(express.json()); // Permite receber JSON no body das requisições

// ================================
// Rotas
// ================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const vendaRoutes = require("./routes/vendaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const modalidadeRoutes = require("./routes/modalidadeRoutes");
const mensalidadeRoutes = require("./routes/mensalidadeRoutes"); // ✅ Adicionado

// Configurando rotas com prefixos
app.use("/api/auth", authRoutes);       // Login: POST /api/auth/login
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/vendas", vendaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/modalidades", modalidadeRoutes);
app.use("/api/mensalidades", mensalidadeRoutes); // ✅ Registrada

// ================================
// Função para criar Super Admin automaticamente
// ================================
async function criarSuperAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;

    const existente = await db.User.findOne({ where: { email: adminEmail } });

    if (!existente) {
      const hash = await bcrypt.hash(adminPass, 10);
      await db.User.create({
        nome: "Super Admin",
        email: adminEmail,
        password: hash,
        perfil: "SUPER_ADMIN",
        escolaId: null,
      });
      console.log(`✅ Super Admin criado: ${adminEmail}`);
    } else {
      console.log(`ℹ️ Super Admin já existe: ${adminEmail}`);
    }
  } catch (error) {
    console.error("❌ Erro ao criar Super Admin:", error);
  }
}

// ================================
// Sincronizar banco e iniciar servidor
// ================================
const PORT = process.env.PORT || 3000;

db.sequelize
  .sync() // ⚠️ Sem 'alter: true'
  .then(async () => {
    console.log("🎯 Banco de dados sincronizado!");
    await criarSuperAdmin();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar banco:", err);
  });

// ================================
// Observação para testes
// ================================
// Para testar login no Postman use:
// POST http://localhost:3000/api/auth/login
// Body -> raw -> JSON:
// {
//   "email": "valdemir.marques1925@gmail.com",
//   "password": "SENHA_DO_SEU_ENV"
// }
