const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const authorize = require('./middleware/permissions');
const authConfig = require('./config/authConfig');

// Modelos
const Aluno = require('./models/Aluno');
const Professor = require('./models/Professor');
const Funcionario = require('./models/funcionario');
const Modalidade = require('./models/Modalidade');
const Turma = require('./models/Turma');
const Usuario = require('./models/Usuario');

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

// --- ROTAS PÚBLICAS ---
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).json({ message: 'Credenciais inválidas.' });
        
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ message: 'Credenciais inválidas.' });
        
        const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, authConfig.secret, { expiresIn: '8h' });
        const respostaUsuario = usuario.toJSON();
        delete respostaUsuario.senha;
        res.json({ usuario: respostaUsuario, token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar login.' });
    }
});

app.post('/usuarios', async (req, res) => {
    try {
        const { email, senha, perfil } = req.body;
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        const novoUsuario = await Usuario.create({ email, senha: senhaHash, perfil });
        const respostaUsuario = novoUsuario.toJSON();
        delete respostaUsuario.senha;
        res.status(201).json(respostaUsuario);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
    }
});

// --- ROTAS PROTEGIDAS ---
const perfisAdmin = ['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE'];

// CRUD Alunos
app.get('/alunos', auth, async (req, res) => { try { const data = await Aluno.findAll(); res.json(data); } catch (e) { res.status(500).send(e.message); } });
app.post('/alunos', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Aluno.create(req.body); res.status(201).json(data); } catch (e) { res.status(400).send(e.message); } });
app.put('/alunos/:id', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Aluno.findByPk(req.params.id); if (data) { await data.update(req.body); res.json(data); } else { res.status(404).send('Not Found'); } } catch (e) { res.status(400).send(e.message); } });
app.delete('/alunos/:id', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Aluno.findByPk(req.params.id); if (data) { await data.destroy(); res.status(204).send(); } else { res.status(404).send('Not Found'); } } catch (e) { res.status(500).send(e.message); } });

// CRUD Professores
app.get('/professores', auth, async (req, res) => { try { const data = await Professor.findAll(); res.json(data); } catch (e) { res.status(500).send(e.message); } });
app.post('/professores', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Professor.create(req.body); res.status(201).json(data); } catch (e) { res.status(400).send(e.message); } });
app.put('/professores/:id', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Professor.findByPk(req.params.id); if (data) { await data.update(req.body); res.json(data); } else { res.status(404).send('Not Found'); } } catch (e) { res.status(400).send(e.message); } });
app.delete('/professores/:id', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Professor.findByPk(req.params.id); if (data) { await data.destroy(); res.status(204).send(); } else { res.status(404).send('Not Found'); } } catch (e) { res.status(500).send(e.message); } });

// CRUD Funcionários
app.get('/funcionarios', auth, async (req, res) => { try { const data = await Funcionario.findAll(); res.json(data); } catch (e) { res.status(500).send(e.message); } });
app.post('/funcionarios', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Funcionario.create(req.body); res.status(201).json(data); } catch (e) { res.status(400).send(e.message); } });

// CRUD Modalidades
app.get('/modalidades', auth, async (req, res) => { try { const data = await Modalidade.findAll(); res.json(data); } catch (e) { res.status(500).send(e.message); } });
app.post('/modalidades', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Modalidade.create(req.body); res.status(201).json(data); } catch (e) { res.status(400).send(e.message); } });

// CRUD Turmas
app.get('/turmas', auth, async (req, res) => { try { const data = await Turma.findAll(); res.json(data); } catch (e) { res.status(500).send(e.message); } });
app.post('/turmas', auth, authorize(perfisAdmin), async (req, res) => { try { const data = await Turma.create(req.body); res.status(201).json(data); } catch (e) { res.status(400).send(e.message); } });

// --- FUNÇÃO DE INICIALIZAÇÃO ---
async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando e visível na rede na porta ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Erro ao iniciar o servidor:', err);
    }
}

start();