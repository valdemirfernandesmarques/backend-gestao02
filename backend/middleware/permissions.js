/**
 * Middleware que verifica se o perfil do usuário logado tem permissão para acessar a rota.
 * @param {Array<string>} perfisPermitidos - Uma lista de perfis que podem acessar a rota.
 * Ex: authorize(['SUPER_ADMIN', 'ADMIN_ESCOLA'])
 */
function authorize(perfisPermitidos = []) {
    return (req, res, next) => {
        // Pegamos o perfil do usuário que foi salvo pelo middleware 'auth.js'
        const { usuarioPerfil } = req;

        // Se o perfil do usuário não estiver na lista de perfis permitidos...
        if (!perfisPermitidos.includes(usuarioPerfil)) {
            // Retorna um erro 403 Forbidden (Proibido)
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para realizar esta ação.' });
        }

        // Se o perfil estiver na lista, permite que a requisição continue
        return next();
    };
}

module.exports = authorize;