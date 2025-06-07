// database/seed.js
const Database = require('better-sqlite3');
const path = require('path');

// Caminho absoluto garantido
const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath, { verbose: console.log }); // Ativa log de queries

// Dados de exemplo
const mesas = [
  // Área interna
  { id: 1, capacidade: 2, localidade: 'Área interna' },
  { id: 2, capacidade: 4, localidade: 'Área interna' }, 
  { id: 3, capacidade: 4, localidade: 'Área interna' },
  { id: 4, capacidade: 4, localidade: 'Área interna' },
  { id: 5, capacidade: 6, localidade: 'Área interna' },
  { id: 6, capacidade: 6, localidade: 'Área interna' },

  // Varanda
  { id: 7, capacidade: 4, localidade: 'Varanda' },
  { id: 8, capacidade: 4, localidade: 'Varanda' },
  { id: 9, capacidade: 2, localidade: 'Varanda' },
  { id: 10, capacidade: 2, localidade: 'Varanda' },

  // Área VIP
  { id: 11, capacidade: 8, localidade: 'Área VIP' },
  { id: 12, capacidade: 6, localidade: 'Área VIP' },
  { id: 13, capacidade: 2, localidade: 'Área VIP' },
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

// JULIANA EM 07/06: popular tabela reservas   
const reservas = [
  { 
    data_reserva: '07/06/2024', 
    hora_reserva: '19:00', 
    id_mesa: 3, 
    qtd_pessoas: 4,
    id_usuario: 1,
    contato: 'res1@email.com',
    status: 'pendente',
    nome_cliente: 'res1@email.com',
    duracao_reserva: '2',

  },
  
  { 
    data_reserva: '07/06/2024', 
    hora_reserva: '19:00', 
    id_mesa: 4, 
    qtd_pessoas: 4,
    id_usuario: 1,
    contato: 'res1@email.com',
    status: 'pendente',
    nome_cliente: 'res2@email.com',
    duracao_reserva: '2',
  },
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
    
    // Insere reservas - JULIANA EM 07/06:    
    const insertReserva = db.prepare(`
      INSERT INTO reservas
      (data_reserva, hora_reserva, id_mesa, qtd_pessoas, id_usuario, contato, status, nome_cliente, duracao_reserva)
      VALUES 
      (@data_reserva, @hora_reserva, @id_mesa, @qtd_pessoas, @id_usuario, @contato, @status, @nome_cliente, @duracao_reserva)
    `); 
    reservas.forEach(reserva => {
      console.log('Inserindo reserva:', reserva);
      insertReserva.run(reserva);
    });

    console.log('Todos os dados foram inseridos!');
  })();
} catch (err) {
  console.error('Erro durante a inserção:', err.message);
} finally {
  db.close();
}