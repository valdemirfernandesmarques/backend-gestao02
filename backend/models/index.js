// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Se DB_PASS estiver vazio, seta como undefined (não envia senha para MySQL)
const sequelize = new Sequelize(
  process.env.DB_NAME || "gestao_danca",
  process.env.DB_USER || "root",
  process.env.DB_PASS && process.env.DB_PASS.trim() !== "" ? process.env.DB_PASS : undefined,
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===== Carrega todos os models =====
db.Escola       = require("./Escola")(sequelize, DataTypes);
db.User         = require("./User")(sequelize, DataTypes);
db.Matricula    = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade  = require("./Mensalidade")(sequelize, DataTypes);
db.Pagamento    = require("./Pagamento")(sequelize, DataTypes);
db.Comissao     = require("./Comissao")(sequelize, DataTypes);
db.Produto      = require("./Produto")(sequelize, DataTypes);
db.Venda        = require("./Venda")(sequelize, DataTypes);

// ======================= ASSOCIAÇÕES =======================

// Escola 1—N Users
db.Escola.hasMany(db.User, { foreignKey: "escolaId" });
db.User.belongsTo(db.Escola, { foreignKey: "escolaId" });

// Matricula 1—N Mensalidade
db.Matricula.hasMany(db.Mensalidade, { foreignKey: "matriculaId" });
db.Mensalidade.belongsTo(db.Matricula, { foreignKey: "matriculaId" });

// Mensalidade 1—N Pagamento
db.Mensalidade.hasMany(db.Pagamento, { foreignKey: "mensalidadeId" });
db.Pagamento.belongsTo(db.Matricula, { foreignKey: "matriculaId" });

// Escola 1—N Pagamento
db.Escola.hasMany(db.Pagamento, { foreignKey: "escolaId" });
db.Pagamento.belongsTo(db.Escola, { foreignKey: "escolaId" });

// Pagamento 1—N Comissao
db.Pagamento.hasMany(db.Comissao, { foreignKey: "pagamentoId", as: "comissoes" });
db.Comissao.belongsTo(db.Pagamento, { foreignKey: "pagamentoId" });

// Produto 1—N Venda
db.Produto.hasMany(db.Venda, { foreignKey: "produtoId" });
db.Venda.belongsTo(db.Produto, { foreignKey: "produtoId" });

// User 1—N Venda
db.User.hasMany(db.Venda, { foreignKey: "compradorId", as: "compras" });
db.Venda.belongsTo(db.User, { foreignKey: "compradorId", as: "comprador" });

module.exports = db;
