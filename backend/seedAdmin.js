// backend/seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./models");

async function seedAdmin() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida!");

    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_PASS;
    const nome = "Super Admin";

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Procura se já existe
    let admin = await db.User.findOne({ where: { email } });

    if (!admin) {
      // Se não existe, cria
      await db.User.create({
        nome,
        email,
        password: hashedPassword,
        perfil: "admin",
        escolaId: 1, // garante que tenha uma escola associada
      });
      console.log(`✅ Super Admin criado: ${email}`);
    } else {
      // Se já existe, atualiza
      admin.password = hashedPassword;
      admin.nome = nome;
      admin.perfil = "admin";
      await admin.save();
      console.log(`🔄 Super Admin atualizado: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar/atualizar Super Admin:", error);
    process.exit(1);
  }
}

seedAdmin();
