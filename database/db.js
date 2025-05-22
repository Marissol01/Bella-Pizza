const Database = require('better-sqlite3');

const db = new Database('./restaurante.db', { verbose: console.log }); 

db.pragma('foreign_keys = ON'); 
module.exports = db;