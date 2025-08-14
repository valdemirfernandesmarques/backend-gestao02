const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { Op } = require('sequelize'); // Importando o Operador do Sequelize

// Importando todos os modelos
const Aluno = require('./models/Aluno');
const Professor = require('./models/Professor');
const Funcionario = require('./models/Funcionario');
const Modalidade = require('./models/Modalidade');
const Turma = require('./models/Turma');
const Usuario = require('./models/Usuario');
const Pagamento = require('./models/Pagamento');
const Matricula = require('./models/Matricula');

const app = express();
const PORT = 3333;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Relacionamentos entre os modelos ---
Professor.hasMany(Turma, { foreignKey: 'professorId' });
Turma.belongsTo(Professor, { as: 'Professor', foreignKey: 'professorId' });

Modalidade.hasMany(Turma, { foreignKey: 'modalidadeId' });
Turma.belongsTo(Modalidade, { as: 'Modalidade', foreignKey: 'modalidadeId' });

Turma.belongsToMany(Aluno, { through: Matricula, foreignKey: 'turmaId', as: 'AlunosMatriculados' });
Aluno.belongsToMany(Turma, { through: Matricula, foreignKey: 'alunoId' });

Aluno.hasMany(Pagamento, { foreignKey: 'alunoId' });
Pagamento.belongsTo(Aluno, { foreignKey: 'alunoId' });


// --- ROTAS DA API ---

// Rota de Teste
app.get('/', (req, res) => res.json({ message: 'API do Gestão em Dança no ar!' }));

// Rota de Login
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ message: 'Senha inválida' });
    const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, 'seu_segredo_jwt', { expiresIn: '8h' });
    res.json({ token, perfil: usuario.perfil });
});

// ROTAS DE CRUD BÁSICAS
const createCrudRoutes = (model, modelName) => {
    const router = express.Router();
    router.post('/', async (req, res) => res.status(201).json(await model.create(req.body)));
    router.get('/', async (req, res) => res.json(await model.findAll()));
    router.get('/:id', async (req, res) => {
        const instance = await model.findByPk(req.params.id);
        if (instance) res.json(instance); else res.status(404).json({ message: `${modelName} não encontrado(a)` });
    });
    router.put('/:id', async (req, res) => {
        const [updated] = await model.update(req.body, { where: { id: req.params.id } });
        if (updated) {
            const updatedInstance = await model.findByPk(req.params.id);
            res.json(updatedInstance);
        } else {
            res.status(404).json({ message: `${modelName} não encontrado(a)` });
        }
    });
    router.delete('/:id', async (req, res) => {
        const deleted = await model.destroy({ where: { id: req.params.id } });
        if (deleted) res.json({ message: `${modelName} excluído(a) com sucesso` });
        else res.status(404).json({ message: `${modelName} não encontrado(a)` });
    });
    return router;
};

app.use('/alunos', createCrudRoutes(Aluno, 'Aluno'));
app.use('/professores', createCrudRoutes(Professor, 'Professor'));
app.use('/funcionarios', createCrudRoutes(Funcionario, 'Funcionário'));
app.use('/modalidades', createCrudRoutes(Modalidade, 'Modalidade'));

// ROTAS DE TURMAS (precisam de includes)
app.get('/turmas', async (req, res) => res.json(await Turma.findAll({ include: ['Professor', 'Modalidade'] })));
app.get('/turmas/:id', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id, { include: ['Professor', 'Modalidade'] });
    if (turma) res.json(turma); else res.status(404).json({ message: 'Turma não encontrada' });
});
app.post('/turmas', async (req, res) => res.status(201).json(await Turma.create(req.body)));
app.put('/turmas/:id', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id);
    if(turma) { await turma.update(req.body); res.json(turma); }
    else { res.status(404).json({ message: 'Turma não encontrada'}); }
});
app.delete('/turmas/:id', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id);
    if(turma) { await turma.destroy(); res.json({ message: 'Turma excluída com sucesso' }); }
    else { res.status(404).json({ message: 'Turma não encontrada'}); }
});


// --- NOVAS ROTAS PARA MATRÍCULAS ---

// 1. Rota para LISTAR os alunos matriculados em uma turma
app.get('/turmas/:id/alunos', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id, {
        include: [{ model: Aluno, as: 'AlunosMatriculados', through: { attributes: [] } }] // through evita trazer dados da tabela Matricula
    });
    if (turma) {
        res.json(turma.AlunosMatriculados);
    } else {
        res.status(404).json({ message: 'Turma não encontrada' });
    }
});

// 2. Rota para LISTAR alunos que NÃO ESTÃO matriculados na turma (para o formulário)
app.get('/turmas/:id/alunos-disponiveis', async (req, res) => {
    const turma = await Turma.findByPk(req.params.id, { include: [{ model: Aluno, as: 'AlunosMatriculados' }] });
    if (!turma) return res.status(404).json({ message: 'Turma não encontrada' });

    const idsAlunosMatriculados = turma.AlunosMatriculados.map(aluno => aluno.id);

    const alunosDisponiveis = await Aluno.findAll({
        where: {
            id: { [Op.notIn]: idsAlunosMatriculados } // Op.notIn -> Onde o ID não esteja na lista de matriculados
        }
    });
    res.json(alunosDisponiveis);
});


// 3. Rota para MATRICULAR um aluno em uma turma
app.post('/turmas/:id/matricular', async (req, res) => {
    try {
        const turma = await Turma.findByPk(req.params.id);
        const aluno = await Aluno.findByPk(req.body.alunoId);

        if (!turma || !aluno) {
            return res.status(404).json({ message: 'Turma ou Aluno não encontrado' });
        }

        await turma.addAlunosMatriculado(aluno); // O Sequelize cria essa função "mágica"
        res.status(201).json({ message: 'Aluno matriculado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao matricular aluno', error: error.message });
    }
});

// 4. Rota para CANCELAR a matrícula de um aluno
app.delete('/turmas/:turmaId/alunos/:alunoId', async (req, res) => {
    try {
        const { turmaId, alunoId } = req.params;
        const turma = await Turma.findByPk(turmaId);
        const aluno = await Aluno.findByPk(alunoId);
        
        if (!turma || !aluno) {
            return res.status(404).json({ message: 'Turma ou Aluno não encontrado' });
        }

        await turma.removeAlunosMatriculado(aluno); // Outra função "mágica" do Sequelize
        res.json({ message: 'Matrícula cancelada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar matrícula', error: error.message });
    }
});


// Função principal que inicia o servidor
async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos sincronizados com o banco de dados.');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Erro ao iniciar o servidor:', err);
    }
}

start();