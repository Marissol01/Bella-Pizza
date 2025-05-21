// database/seed.js
const Database = require('better-sqlite3');
const path = require('path');

// Caminho absoluto garantido
const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath, { verbose: console.log }); // Ativa log de queries

// Dados de exemplo
const mesas = [
  { id: 1, capacidade: 4, localidade: 'Área interna' },
  { id: 2, capacidade: 6, localidade: 'Varanda' }, 
  { id: 3, capacidade: 8, localidade: 'Área VIP' }
];

const usuarios = [
  { 
    nome: 'João Atendente', 
    tipo_funcionario: 'Atendente', 
    user_name: 'joao',
    senha_usuario: '123',
    email: 'joao@restaurante.com'
  },
  // ... outros usuários
];

try {
  db.transaction(() => {
    console.log('Iniciando inserção de dados...');
    
    // Limpa tabelas (REMOVA EM PRODUÇÃO!)
    db.exec('DELETE FROM mesas; DELETE FROM usuarios;');

    // Insere mesas
    const insertMesa = db.prepare(`
      INSERT INTO mesas (id_mesa, capacidade, localidade) 
      VALUES (@id, @capacidade, @localidade)
    `);
    mesas.forEach(mesa => {
      console.log('Inserindo mesa:', mesa);
      insertMesa.run(mesa);
    });

    // Insere usuários
    const insertUsuario = db.prepare(`
      INSERT INTO usuarios 
      (nome, tipo_funcionario, user_name, senha_usuario, email)
      VALUES 
      (@nome, @tipo_funcionario, @user_name, @senha_usuario, @email)
    `);
    usuarios.forEach(usuario => {
      console.log('Inserindo usuário:', usuario.nome);
      insertUsuario.run(usuario);
    });

    console.log('Todos os dados foram inseridos!');
  })();
} catch (err) {
  console.error('Erro durante a inserção:', err.message);
} finally {
  db.close();
}