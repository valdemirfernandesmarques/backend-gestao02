// backend/models/index.js
const sequelize = require('../config/database');

// Importa todos os models
const Escola = require('./Escola');
const User = require('./User');
const Professor = require('./Professor');
const Aluno = require('./Aluno');
const Modalidade = require('./Modalidade');
const Turma = require('./Turma');
const Matricula = require('./Matricula');
const Mensalidade = require('./Mensalidade');
const Pagamento = require('./Pagamento');

// ================== RELACIONAMENTOS ================== //

// 📌 Escola
Escola.hasMany(User, { foreignKey: 'escolaId', as: 'usuarios' });
User.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

Escola.hasMany(Professor, { foreignKey: 'escolaId', as: 'professores' });
Professor.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

Escola.hasMany(Aluno, { foreignKey: 'escolaId', as: 'alunos' });
Aluno.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

Escola.hasMany(Modalidade, { foreignKey: 'escolaId', as: 'modalidades' });
Modalidade.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

Escola.hasMany(Turma, { foreignKey: 'escolaId', as: 'turmas' });
Turma.belongsTo(Escola, { foreignKey: 'escolaId', as: 'escola' });

// 📌 Turma
Turma.belongsTo(Professor, { foreignKey: 'professorId', as: 'professor' });
Professor.hasMany(Turma, { foreignKey: 'professorId', as: 'turmas' });

Turma.belongsTo(Modalidade, { foreignKey: 'modalidadeId', as: 'modalidade' });
Modalidade.hasMany(Turma, { foreignKey: 'modalidadeId', as: 'turmas' });

// 📌 Matrícula
Matricula.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'aluno' });
Aluno.hasMany(Matricula, { foreignKey: 'alunoId', as: 'matriculas' });

Matricula.belongsTo(Turma, { foreignKey: 'turmaId', as: 'turma' });
Turma.hasMany(Matricula, { foreignKey: 'turmaId', as: 'matriculas' });

// 📌 Mensalidade
Mensalidade.belongsTo(Matricula, { foreignKey: 'matriculaId', as: 'matricula' });
Matricula.hasMany(Mensalidade, { foreignKey: 'matriculaId', as: 'mensalidades' });

// 📌 Pagamento
Pagamento.belongsTo(Mensalidade, { foreignKey: 'mensalidadeId', as: 'mensalidade' });
Mensalidade.hasMany(Pagamento, { foreignKey: 'mensalidadeId', as: 'pagamentos' });

// ================== EXPORTA ================== //
module.exports = {
  sequelize,
  Escola,
  User,
  Professor,
  Aluno,
  Modalidade,
  Turma,
  Matricula,
  Mensalidade,
  Pagamento
};
