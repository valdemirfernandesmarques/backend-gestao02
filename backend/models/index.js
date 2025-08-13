const express = require('express');
const sequelize = require('./config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('./middleware/auth');
const authorize = require('./middleware/permissions');
const authConfig = require('./config/authConfig');

// --- IMPORTANDO TODOS OS MODELOS ---
const Aluno = require('./models/Aluno');
const Professor = require('./models/Professor');
const Modalidade = require('./models/Modalidade');
const Turma = require('./models/Turma');
const Usuario = require('./models/Usuario');
const Matricula = require('./models/Matricula');
const LogAtividade = require('./models/LogAtividade');
const Pagamento = require('./models/Pagamento');
const Configuracao = require('./models/Configuracao');

const app = express();
const PORT = 3333;

// --- DEFININDO OS RELACIONAMENTOS ---
Professor.hasMany(Turma, { foreignKey: 'professorId' });
Turma.belongsTo(Professor, { foreignKey: 'professorId' });
Modalidade.hasMany(Turma, { foreignKey: 'modalidadeId' });
Turma.belongsTo(Modalidade, { foreignKey: 'modalidadeId' });
Aluno.belongsToMany(Turma, { through: Matricula, foreignKey: 'alunoId' });
Turma.belongsToMany(Aluno, { through: Matricula, foreignKey: 'turmaId' });
Usuario.hasMany(LogAtividade, { foreignKey: 'usuarioId' });
LogAtividade.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Aluno.hasMany(Pagamento, { foreignKey: 'alunoId' });
Pagamento.belongsTo(Aluno, { foreignKey: 'alunoId' });
Turma.hasMany(Pagamento, { foreignKey: 'turmaId' });
Pagamento.belongsTo(Turma, { foreignKey: 'turmaId' });

// HABILITANDO O LEITOR DE JSON
app.use(express.json());

// Função principal que inicia tudo
async function start() { try { await sequelize.authenticate(); console.log('✅ Conexão com o banco de dados estabelecida com sucesso!'); console.log('🔄 Usando Migrations para controle do banco de dados.'); app.listen(PORT, () => { console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`); }); } catch (err) { console.error('❌ Erro ao iniciar o servidor:', err); } }

// --- ROTAS DA API ---
app.get('/', (req, res) => res.json({ message: 'API do Gestão em Dança no ar!' }));

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIOS (PÚBLICAS) ---
app.post('/usuarios', async (req, res) => { try { const { email, senha, perfil } = req.body; const salt = await bcrypt.genSalt(10); const senhaHash = await bcrypt.hash(senha, salt); const novoUsuario = await Usuario.create({ email: email, senha: senhaHash, perfil: perfil }); const respostaUsuario = novoUsuario.toJSON(); delete respostaUsuario.senha; res.status(201).json(respostaUsuario); } catch (error) { res.status(400).json({ message: 'Erro ao cadastrar usuário.', error: error.message }); } });
app.post('/login', async (req, res) => { try { const { email, senha } = req.body; const usuario = await Usuario.findOne({ where: { email: email } }); if (!usuario) { return res.status(401).json({ message: 'Email ou senha inválidos.' }); } const senhaValida = await bcrypt.compare(senha, usuario.senha); if (!senhaValida) { return res.status(401).json({ message: 'Email ou senha inválidos.' }); } const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil }, authConfig.secret, { expiresIn: '8h' }); const respostaUsuario = usuario.toJSON(); delete respostaUsuario.senha; res.json({ usuario: respostaUsuario, token: token }); } catch (error) { res.status(500).json({ message: 'Erro ao realizar login.', error: error.message }); } });
app.post('/forgot-password', async (req, res) => { try { const { email } = req.body; const usuario = await Usuario.findOne({ where: { email } }); if (!usuario) { return res.json({ message: 'Se um usuário com este email existir, um link de recuperação de senha será enviado.' }); } const resetToken = crypto.randomBytes(20).toString('hex'); const resetExpires = new Date(Date.now() + 3600000); await usuario.update({ senhaResetToken: resetToken, senhaResetExpires: resetExpires }); console.log('--- RECUPERAÇÃO DE SENHA ---'); console.log('Token gerado para', email, ':', resetToken); console.log('----------------------------'); res.json({ message: 'Se um usuário com este email existir, um link de recuperação de senha será enviado.' }); } catch (error) { res.status(500).json({ message: 'Erro ao solicitar recuperação de senha.', error: error.message }); } });
app.post('/reset-password', async (req, res) => { try { const { token, novaSenha } = req.body; const usuario = await Usuario.findOne({ where: { senhaResetToken: token } }); if (!usuario) { return res.status(400).json({ message: 'Token de recuperação inválido ou expirado.' }); } const salt = await bcrypt.genSalt(10); const senhaHash = await bcrypt.hash(novaSenha, salt); await usuario.update({ senha: senhaHash, senhaResetToken: null, senhaResetExpires: null }); res.json({ message: 'Senha atualizada com sucesso!' }); } catch (error) { res.status(500).json({ message: 'Erro ao resetar senha.', error: error.message }); } });

// --- ROTAS PROTEGIDAS ---
// (CRUDs de Alunos, Modalidades, Professores, Turmas, Matrículas e Pagamentos continuam aqui)
app.post('/alunos', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Aluno.create(req.body); res.status(201).json(d); } catch (e) { res.status(400).json({ message: 'Erro ao cadastrar aluno', error: e.message }); } });
app.get('/alunos', auth, async (req, res) => { try { const d = await Aluno.findAll(); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar alunos.', error: e.message }); } });
app.get('/alunos/:id', auth, async (req, res) => { try { const d = await Aluno.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Aluno não encontrado.' }); } res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar aluno.', error: e.message }); } });
app.put('/alunos/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Aluno.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Aluno não encontrado.' }); } await d.update(req.body); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao atualizar aluno.', error: e.message }); } });
app.delete('/alunos/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Aluno.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Aluno não encontrado.' }); } await d.destroy(); res.json({ message: 'Aluno excluído com sucesso.' }); } catch (e) { res.status(500).json({ message: 'Erro ao excluir aluno.', error: e.message }); } });
app.get('/alunos/:alunoId/turmas', auth, async (req, res) => { try { const { alunoId } = req.params; const aluno = await Aluno.findByPk(alunoId, { include: [{ model: Turma }] }); if (!aluno) { return res.status(404).json({ message: 'Aluno não encontrado.' }); } res.json(aluno.Turmas); } catch (error) { res.status(500).json({ message: 'Erro ao buscar turmas do aluno.', error: e.message }); } });
app.post('/modalidades', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA']), async (req, res) => { try { const d = await Modalidade.create(req.body); res.status(201).json(d); } catch (e) { res.status(400).json({ message: 'Erro ao cadastrar modalidade.', error: e.message }); } });
app.get('/modalidades', auth, async (req, res) => { try { const d = await Modalidade.findAll(); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar modalidades.', error: e.message }); } });
app.put('/modalidades/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA']), async (req, res) => { try { const d = await Modalidade.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Modalidade não encontrada.' }); } await d.update(req.body); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao atualizar modalidade.', error: e.message }); } });
app.delete('/modalidades/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA']), async (req, res) => { try { const d = await Modalidade.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Modalidade não encontrada.' }); } await d.destroy(); res.json({ message: 'Modalidade excluída com sucesso.' }); } catch (e) { res.status(500).json({ message: 'Erro ao excluir modalidade.', error: e.message }); } });
app.post('/professores', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Professor.create(req.body); res.status(201).json(d); } catch (e) { res.status(400).json({ message: 'Erro ao cadastrar professor.', error: e.message }); } });
app.get('/professores', auth, async (req, res) => { try { const d = await Professor.findAll(); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar professores.', error: e.message }); } });
app.get('/professores/:id', auth, async (req, res) => { try { const d = await Professor.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Professor não encontrado.' }); } res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar professor.', error: e.message }); } });
app.put('/professores/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Professor.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Professor não encontrado.' }); } await d.update(req.body); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao atualizar professor.', error: e.message }); } });
app.delete('/professores/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA']), async (req, res) => { try { const d = await Professor.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Professor não encontrado.' }); } await d.destroy(); res.json({ message: 'Professor excluído com sucesso.' }); } catch (e) { res.status(500).json({ message: 'Erro ao excluir professor.', error: e.message }); } });
app.post('/turmas', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Turma.create(req.body); res.status(201).json(d); } catch (e) { res.status(400).json({ message: 'Erro ao criar turma.', error: e.message }); } });
app.get('/turmas', auth, async (req, res) => { try { const d = await Turma.findAll({ include: [{ model: Professor, attributes: ['nomeCompleto', 'email'] }, { model: Modalidade, attributes: ['nome'] }] }); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar turmas.', error: e.message }); } });
app.get('/turmas/:id', auth, async (req, res) => { try { const d = await Turma.findByPk(req.params.id, { include: [{ model: Professor }, { model: Modalidade }] }); if (!d) { return res.status(404).json({ message: 'Turma não encontrada.' }); } res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar turma.', error: e.message }); } });
app.put('/turmas/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Turma.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Turma não encontrada.' }); } await d.update(req.body); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao atualizar turma.', error: e.message }); } });
app.delete('/turmas/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const turma = await Turma.findByPk(req.params.id); if (!turma) { return res.status(404).json({ message: 'Turma não encontrada.' }); } const nomeDaTurma = turma.nome; await turma.destroy(); const descricaoLog = `O usuário com ID ${req.usuarioId} deletou a turma ID ${req.params.id} ('${nomeDaTurma}').`; await LogAtividade.create({ descricao: descricaoLog, usuarioId: req.usuarioId }); res.json({ message: 'Turma excluída com sucesso.' }); } catch (e) { res.status(500).json({ message: 'Erro ao excluir turma.', error: e.message }); } });
app.post('/turmas/:turmaId/alunos', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const { turmaId } = req.params; const { alunoId } = req.body; const turma = await Turma.findByPk(turmaId); const aluno = await Aluno.findByPk(alunoId); if (!turma) { return res.status(404).json({ message: 'Turma não encontrada.' }); } if (!aluno) { return res.status(404).json({ message: 'Aluno não encontrado.' }); } const novaMatricula = await Matricula.create({ turmaId: turmaId, alunoId: alunoId }); res.status(201).json({ message: 'Aluno matriculado com sucesso!', matricula: novaMatricula }); } catch (error) { res.status(500).json({ message: 'Erro ao matricular aluno.', error: error.message }); } });
app.get('/turmas/:turmaId/alunos', auth, async (req, res) => { try { const { turmaId } = req.params; const turma = await Turma.findByPk(turmaId, { include: [{ model: Aluno }] }); if (!turma) { return res.status(404).json({ message: 'Turma não encontrada.' }); } res.json(turma.Alunos); } catch (error) { res.status(500).json({ message: 'Erro ao buscar alunos da turma.', error: error.message }); } });
app.delete('/turmas/:turmaId/alunos/:alunoId', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const { turmaId, alunoId } = req.params; const matricula = await Matricula.findOne({ where: { turmaId: turmaId, alunoId: alunoId } }); if (!matricula) { return res.status(404).json({ message: 'Matrícula não encontrada.' }); } await matricula.destroy(); res.json({ message: 'Matrícula cancelada com sucesso.' }); } catch (error) { res.status(500).json({ message: 'Erro ao cancelar matrícula.', error: error.message }); } });
app.post('/pagamentos', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Pagamento.create(req.body); res.status(201).json(d); } catch (e) { res.status(400).json({ message: 'Erro ao registrar pagamento.', error: e.message }); } });
app.get('/pagamentos', auth, async (req, res) => { try { const d = await Pagamento.findAll({ include: [Aluno, Turma] }); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar pagamentos.', error: e.message }); } });
app.get('/pagamentos/:id', auth, async (req, res) => { try { const d = await Pagamento.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Pagamento não encontrado.' }); } res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao buscar pagamento.', error: e.message }); } });
app.put('/pagamentos/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA', 'ADMIN_GERENTE']), async (req, res) => { try { const d = await Pagamento.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Pagamento não encontrado.' }); } await d.update(req.body); res.json(d); } catch (e) { res.status(500).json({ message: 'Erro ao atualizar pagamento.', error: e.message }); } });
app.delete('/pagamentos/:id', auth, authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA']), async (req, res) => { try { const d = await Pagamento.findByPk(req.params.id); if (!d) { return res.status(404).json({ message: 'Pagamento não encontrado.' }); } await d.destroy(); res.json({ message: 'Pagamento excluído com sucesso.' }); } catch (e) { res.status(500).json({ message: 'Erro ao excluir pagamento.', error: e.message }); } });

// --- NOVO! ROTAS DA API DE CONFIGURAÇÕES (PROTEGIDAS) ---
app.post('/configuracoes', auth, authorize(['SUPER_ADMIN']), async (req, res) => {
    try {
        const { chave, valor } = req.body;
        let config = await Configuracao.findOne({ where: { chave } });
        if (config) {
            config.valor = valor;
            await config.save();
        } else {
            config = await Configuracao.create({ chave, valor });
        }
        res.status(201).json(config);
    } catch (e) {
        res.status(400).json({ message: 'Erro ao salvar configuração.', error: e.message });
    }
});
app.get('/configuracoes/:chave', auth, async (req, res) => {
    try {
        const { chave } = req.params;
        const config = await Configuracao.findOne({ where: { chave } });
        if (!config) {
            return res.status(404).json({ message: 'Configuração não encontrada.' });
        }
        res.json(config);
    } catch (e) {
        res.status(500).json({ message: 'Erro ao buscar configuração.', error: e.message });
    }
});

start();