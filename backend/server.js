// backend/server.js
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const db = require("./models");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// Conexão com banco de dados
// ================================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS && process.env.DB_PASS.trim() !== "" ? process.env.DB_PASS : null,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Conexão com MySQL estabelecida com sucesso."))
  .catch((err) => console.error("❌ Erro ao conectar no MySQL:", err));

// ================================
// Rotas
// ================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const estoqueRoutes = require("./routes/estoqueRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/estoque", estoqueRoutes);

// ================================
// Criar Super Admin automaticamente
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
        perfil: "admin",
        escolaId: 1, // pode ajustar se necessário
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
// Sincronizar Banco e Rodar Servidor
// ================================
const PORT = process.env.PORT || 3000;

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("🎯 Banco de dados sincronizado!");

    // Garante que o Super Admin exista
    await criarSuperAdmin();

    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar banco:", err);
  });
