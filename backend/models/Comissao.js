// backend/models/Comissao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Professor = require('./Professor');
const Pagamento = require('./Pagamento');

const Comissao = sequelize.define('Comissao', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  percentual: {
    type: DataTypes.FLOAT, // ex.: 0.5 = 50%
    allowNull: false,
    defaultValue: 0.5
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'comissoes'
});

// Relacionamentos
Professor.hasMany(Comissao, { foreignKey: 'professorId', as: 'comissoes' });
Comissao.belongsTo(Professor, { foreignKey: 'professorId', as: 'professor' });

Pagamento.hasOne(Comissao, { foreignKey: 'pagamentoId', as: 'comissao' });
Comissao.belongsTo(Pagamento, { foreignKey: 'pagamentoId', as: 'pagamento' });

module.exports = Comissao;
