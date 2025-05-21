const Database = require('better-sqlite3');

// Conecta ao banco
const db = new Database('./restaurante.db');

//Habilita verificação de chave estrangeira
db.pragma('foreign_keys = ON');

//Exposta
module.exports = db;