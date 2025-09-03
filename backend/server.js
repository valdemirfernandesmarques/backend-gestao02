const express = require("express");
const cors = require("cors");
const db = require("./models");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// Rotas
// ================================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/escolas", escolaRoutes);
app.use("/api/produtos", produtoRoutes);

// ================================
// Criar Super Admin automaticamente
// ================================
const bcrypt = require("bcryptjs");
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
// Sincronizar Banco e Rodar Servidor
// ================================
const PORT = process.env.PORT || 3000;

db.sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("🎯 Banco de dados sincronizado!");
    await criarSuperAdmin();
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar banco:", err);
  });
