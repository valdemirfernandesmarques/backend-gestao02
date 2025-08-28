// models/Associacoes.js
const User = require('./User');
const Escola = require('./Escola');
const Professor = require('./Professor');
const Modalidade = require('./Modalidade');
const Turma = require('./Turma');
const Aluno = require('./Aluno');
const Matricula = require('./Matricula');
const Mensalidade = require('./Mensalidade');
const Pagamento = require('./Pagamento');
const Comissao = require('./Comissao');

// Escola -> Alunos
Escola.hasMany(Aluno, { foreignKey: 'escolaId', as: 'escola_alunos' });
Aluno.belongsTo(Escola, { foreignKey: 'escolaId', as: 'aluno_escola' });

// Escola -> Professores
Escola.hasMany(Professor, { foreignKey: 'escolaId', as: 'escola_professores' });
Professor.belongsTo(Escola, { foreignKey: 'escolaId', as: 'professor_escola' });

// Escola -> Modalidades
Escola.hasMany(Modalidade, { foreignKey: 'escolaId', as: 'escola_modalidades' });
Modalidade.belongsTo(Escola, { foreignKey: 'escolaId', as: 'modalidade_escola' });

// Escola -> Turmas
Escola.hasMany(Turma, { foreignKey: 'escolaId', as: 'escola_turmas' });
Turma.belongsTo(Escola, { foreignKey: 'escolaId', as: 'turma_escola' });

// Professor -> Turmas
Professor.hasMany(Turma, { foreignKey: 'professorId', as: 'professor_turmas' });
Turma.belongsTo(Professor, { foreignKey: 'professorId', as: 'turma_professor' });

// Modalidade -> Turmas
Modalidade.hasMany(Turma, { foreignKey: 'modalidadeId', as: 'modalidade_turmas' });
Turma.belongsTo(Modalidade, { foreignKey: 'modalidadeId', as: 'turma_modalidade' });

// Aluno -> Matrículas
Aluno.hasMany(Matricula, { foreignKey: 'alunoId', as: 'aluno_matriculas' });
Matricula.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'matricula_aluno' });

// Turma -> Matrículas
Turma.hasMany(Matricula, { foreignKey: 'turmaId', as: 'turma_matriculas' });
Matricula.belongsTo(Turma, { foreignKey: 'turmaId', as: 'matricula_turma' });

// Matrícula -> Mensalidades
Matricula.hasMany(Mensalidade, { foreignKey: 'matriculaId', as: 'matricula_mensalidades' });
Mensalidade.belongsTo(Matricula, { foreignKey: 'matriculaId', as: 'mensalidade_matricula' });

// Mensalidade -> Pagamentos
Mensalidade.hasMany(Pagamento, { foreignKey: 'mensalidadeId', as: 'mensalidade_pagamentos' });
Pagamento.belongsTo(Mensalidade, { foreignKey: 'mensalidadeId', as: 'pagamento_mensalidade' });

// Escola -> Comissões
Escola.hasMany(Comissao, { foreignKey: 'escolaId', as: 'escola_comissoes' });
Comissao.belongsTo(Escola, { foreignKey: 'escolaId', as: 'comissao_escola' });

// Professor -> Comissões
Professor.hasMany(Comissao, { foreignKey: 'professorId', as: 'professor_comissoes' });
Comissao.belongsTo(Professor, { foreignKey: 'professorId', as: 'comissao_professor' });

module.exports = {
  User,
  Escola,
  Professor,
  Modalidade,
  Turma,
  Aluno,
  Matricula,
  Mensalidade,
  Pagamento,
  Comissao
};
