// backend/seedAdminEscola.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./models");

async function seedAdminEscola() {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexão com o banco estabelecida!");

    // Ajuste aqui caso queira mudar depois
    const email = "admin@escolateste.com";
    const senha = "123456"; // você pode usar outra senha fixa ou variável de ambiente
    const nome = "Admin Escola Teste";
    const escolaId = 2; // id da escola que já existe no banco

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Procura se já existe usuário com esse e-mail
    let admin = await db.User.findOne({ where: { email } });

    if (!admin) {
      // Se não existe, cria
      await db.User.create({
        nome,
        email,
        password: hashedPassword,
        perfil: "ADMIN_ESCOLA", // ✅ novo perfil específico
        escolaId,
      });
      console.log(`✅ Admin Escola criado: ${email}`);
    } else {
      // Se já existe, atualiza
      admin.password = hashedPassword;
      admin.nome = nome;
      admin.perfil = "ADMIN_ESCOLA"; // ✅ garante perfil correto
      admin.escolaId = escolaId;
      await admin.save();
      console.log(`🔄 Admin Escola atualizado: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar/atualizar Admin Escola:", error);
    process.exit(1);
  }
}

seedAdminEscola();
