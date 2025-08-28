// backend/models/index.js
const sequelize = require('../config/database');

// Importa todos os models
const Escola = require('./Escola');
const User = require('./User');
const Matricula = require('./Matricula');
const Mensalidade = require('./Mensalidade');
const Pagamento = require('./Pagamento');
const Comissao = require('./Comissao');

// ========================
// Associações
// ========================

// Escola -> Usuários
Escola.hasMany(User, { foreignKey: 'escolaId', as: 'usuarios' });
User.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

// Escola -> Matrículas
Escola.hasMany(Matricula, { foreignKey: 'escolaId', as: 'matriculas' });
Matricula.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

// Matrícula -> Mensalidades
Matricula.hasMany(Mensalidade, { foreignKey: 'matriculaId', as: 'mensalidades' });
Mensalidade.belongsTo(Matricula, { foreignKey: 'matriculaId', as: 'matricula' });

// Mensalidade -> Pagamentos
Mensalidade.hasMany(Pagamento, { foreignKey: 'mensalidadeId', as: 'pagamentos' });
Pagamento.belongsTo(Mensalidade, { foreignKey: 'mensalidadeId', as: 'mensalidade' });

// Escola -> Pagamentos (para relatórios financeiros)
Escola.hasMany(Pagamento, { foreignKey: 'escolaId', as: 'pagamentos' });
Pagamento.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

// Pagamento -> Comissões
Pagamento.hasMany(Comissao, { foreignKey: 'pagamentoId', as: 'comissoes' });
Comissao.belongsTo(Pagamento, { foreignKey: 'pagamentoId' }); // ⚠️ sem alias duplicado aqui

// ========================
// Exporta models + conexão
// ========================
module.exports = {
  sequelize,
  Escola,
  User,
  Matricula,
  Mensalidade,
  Pagamento,
  Comissao,
};
