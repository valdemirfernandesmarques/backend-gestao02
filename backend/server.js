const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models"); // aqui já importa sequelize e models

const app = express();
app.use(cors());
app.use(express.json());

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
// Sincronizar Banco e Rodar Servidor
// ================================
const PORT = process.env.PORT || 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexão com MySQL estabelecida com sucesso.");
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("🎯 Banco de dados sincronizado!");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar/sincronizar banco:", err);
  });
