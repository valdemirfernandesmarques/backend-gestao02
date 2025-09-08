// backend/models/index.js
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Configuração do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || "gestao_danca",
  process.env.DB_USER || "root",
  process.env.DB_PASS !== undefined ? process.env.DB_PASS : "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
    timezone: "-03:00",
  }
);

// Teste de conexão
sequelize.authenticate()
  .then(() => console.log("Conexão com MySQL OK!"))
  .catch(err => console.error("Erro de conexão:", err));

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ===== Carrega models =====
db.Escola      = require("./Escola")(sequelize, DataTypes);
db.User        = require("./User")(sequelize, DataTypes);
db.Matricula   = require("./Matricula")(sequelize, DataTypes);
db.Mensalidade = require("./Mensalidade")(sequelize, DataTypes);
db.Pagamento   = require("./Pagamento")(sequelize, DataTypes);
db.Comissao    = require("./Comissao")(sequelize, DataTypes);
db.Produto     = require("./Produto")(sequelize, DataTypes);
db.Venda       = require("./Venda")(sequelize, DataTypes);
db.VendaItem   = require("./VendaItem")(sequelize, DataTypes);
db.Modalidade  = require("./Modalidade")(sequelize);

// ======================= ASSOCIAÇÕES =======================

// Escola <-> User
db.Escola.hasMany(db.User, { foreignKey: "escolaId", as: "usuarios" });
db.User.belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });

// Escola <-> Matricula
db.Escola.hasMany(db.Matricula, { foreignKey: "escolaId", as: "matriculas" });
db.Matricula.belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });

// Matricula <-> Mensalidade
db.Matricula.hasMany(db.Mensalidade, { foreignKey: "matriculaId", as: "mensalidades" });
db.Mensalidade.belongsTo(db.Matricula, { foreignKey: "matriculaId", as: "matricula" });

// Mensalidade <-> Pagamento
db.Mensalidade.hasMany(db.Pagamento, { foreignKey: "mensalidadeId", as: "pagamentos" });
db.Pagamento.belongsTo(db.Mensalidade, { foreignKey: "mensalidadeId", as: "mensalidade" });

// Pagamento <-> Escola
db.Escola.hasMany(db.Pagamento, { foreignKey: "escolaId", as: "pagamentos" });
db.Pagamento.belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });

// Pagamento <-> Comissao
db.Pagamento.hasMany(db.Comissao, { foreignKey: "pagamentoId", as: "comissoes" });
db.Comissao.belongsTo(db.Pagamento, { foreignKey: "pagamentoId", as: "pagamento" });

// Produto <-> VendaItem
db.Produto.hasMany(db.VendaItem, { foreignKey: "produtoId", as: "itensVenda" });
db.VendaItem.belongsTo(db.Produto, { foreignKey: "produtoId", as: "produto" });

// Venda <-> VendaItem
db.Venda.hasMany(db.VendaItem, { foreignKey: "vendaId", as: "itens" });
db.VendaItem.belongsTo(db.Venda, { foreignKey: "vendaId", as: "venda" });

// User <-> Venda
db.User.hasMany(db.Venda, { foreignKey: "usuarioId", as: "vendas" });
db.Venda.belongsTo(db.User, { foreignKey: "usuarioId", as: "usuario" });

// Escola <-> Produto
db.Escola.hasMany(db.Produto, { foreignKey: "escolaId", as: "produtos" });
db.Produto.belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });

// Escola <-> Modalidade
db.Escola.hasMany(db.Modalidade, { foreignKey: "escolaId", as: "modalidades" });
db.Modalidade.belongsTo(db.Escola, { foreignKey: "escolaId", as: "escola" });

module.exports = db;
