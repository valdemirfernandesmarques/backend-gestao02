const jwt = require('jsonwebtoken');
const authConfig = require('../config/authConfig'); // <-- MUDANÇA: Importa a configuração

function auth(req, res, next) {
    // console.log('Cabeçalhos Recebidos:', req.headers); // Podemos remover ou comentar o debug
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token.' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token mal formatado.' });
    }

    // MUDANÇA: Usa o segredo do arquivo de configuração
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        req.usuarioId = decoded.id;
        req.usuarioPerfil = decoded.perfil;
        return next();
    });
}

module.exports = auth;