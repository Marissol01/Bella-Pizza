// database/seed.js
const Database = require('better-sqlite3');
const path = require('path');

// Caminho absoluto garantido
const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath, { verbose: console.log }); // Ativa log de queries

// Dados de exemplo
const mesas = [
  // Área interna
  { id: 1, capacidade: 2, localidade: 'Área interna', disponibilidade:1 },
  { id: 2, capacidade: 4, localidade: 'Área interna' ,disponibilidade:1}, 
  { id: 3, capacidade: 4, localidade: 'Área interna' ,disponibilidade:1},
  { id: 4, capacidade: 4, localidade: 'Área interna' ,disponibilidade:1},
  { id: 5, capacidade: 6, localidade: 'Área interna' ,disponibilidade:1},
  { id: 6, capacidade: 6, localidade: 'Área interna' ,disponibilidade:1},

  // Varanda
  { id: 7, capacidade: 4, localidade: 'Varanda' , disponibilidade:1},
  { id: 8, capacidade: 4, localidade: 'Varanda' , disponibilidade:1},
  { id: 9, capacidade: 2, localidade: 'Varanda' , disponibilidade:1},
  { id: 10, capacidade: 2, localidade: 'Varanda' , disponibilidade:1},

  // Área VIP
  { id: 11, capacidade: 8, localidade: 'Área VIP', disponibilidade:1 },
  { id: 12, capacidade: 6, localidade: 'Área VIP' , disponibilidade:1},
  { id: 13, capacidade: 2, localidade: 'Área VIP' , disponibilidade:1},
];

const usuarios = [
  { 
    nome: 'João Atendente', 
    tipo_funcionario: 'Atendente', 
    user_name: 'joao',
    senha_usuario: '123',
    email: 'joao@restaurante.com'
  },
  
  {
    nome: 'Mario Garçom',
    tipo_funcionario: 'Garçom',
    user_name: 'mario',
    senha_usuario: '123',
    email: 'mario@restaurante.com'
  },

  {
    nome: 'Maria Gerente',
    tipo_funcionario: 'Gerente',
    user_name: 'maria',
    senha_usuario: '123',
    email: 'maria@restaurante.com'
  }
];

try {
  db.transaction(() => {
    console.log('Iniciando inserção de dados...');
    
    // Limpa tabelas (REMOVA EM PRODUÇÃO!)
    db.exec('DELETE FROM mesas; DELETE FROM usuarios;');

    // Insere mesas
    const insertMesa = db.prepare(`
      INSERT INTO mesas (id_mesa, capacidade, localidade,disponibilidade) 
      VALUES (@id, @capacidade, @localidade,@disponibilidade)
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