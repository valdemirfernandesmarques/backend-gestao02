// Importa o Sequelize
const Sequelize = require('sequelize');

// --- ATUALIZE COM SUAS CREDENCIAIS DO BANCO DE DADOS ---
const DB_NAME = 'gestao_em_danca_db';
const DB_USER = 'root'; // ou o seu usuário
const DB_PASS = ''; // ou sua senha
const DB_CONFIG = {
    dialect: 'mysql', // O tipo de banco que estamos usando
    host: 'localhost',
    port: 3306 // A porta padrão do MySQL
};

// Cria a conexão com o banco de dados
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, DB_CONFIG);

// Exportamos a conexão para que outros arquivos possam usá-la
module.exports = sequelize;