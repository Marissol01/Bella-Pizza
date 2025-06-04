// database/check-db.js
const Database = require('better-sqlite3');
const path = require('path');


const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath, { verbose: console.log }); // Ativa logs

console.log(" Verificando banco em:", dbPath);

// Verifica tabelas
const tabelas = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all()
  .map(t => t.name);

console.log('\n Tabelas existentes:', tabelas);

// Verifica dados em cada tabela
tabelas.forEach(tabela => {
  try {
    const dados = db.prepare(`SELECT * FROM ${tabela} LIMIT 3`).all();
    console.log(`\n ${tabela} (${dados.length} registros):`);
    console.log(dados);
  } catch (e) {
    console.error(` Erro ao verificar ${tabela}:`, e.message);
  }
});

db.close();