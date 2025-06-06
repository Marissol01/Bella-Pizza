//Arquivo Para testes com o Banco

const path = require('path');
const fs = require('fs');

const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath);
// O cabeçalho acima é estritamente obrigatório, para todo tipo de teste

console.log('Caminho do banco:', dbPath); // verificar se o arquivo foi localizado
console.log(__dirname); 
const tabelas = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all(); //Listar todas as tabelas
console.log('Tabelas existentes:', tabelas.map(t => t.name));


// Testa se o arquivo existe
if (fs.existsSync(dbPath)) {
  console.log('✅ Banco de dados encontrado.');
} else {
  console.log('❌ Arquivo de banco de dados NÃO encontrado.');
}

//Teste de Inserção de novas mesas✅
const insert = db.prepare(`
  INSERT INTO mesas (capacidade, localidade, disponibilidade)
  VALUES (?, ?, ?)
`);

//inserir novas mesas
/*const mesas = [
  [10, "salão B", 1],     // false => 0
  [10, "salão C", 1],
  [10, "Varanda", 1],
  [10, "Salão D", 1]  
];

mesas.forEach(mesa => {
  console.log('Inserindo mesa:', mesa);
  insert.run(...mesa); // Aqui ele realmente insere no banco!
});*/

const todas = db.prepare("SELECT * FROM mesas").all();
console.log("Mesas no banco:", todas);

//teste de integridade referencial(tabela mesas->tabela reservas)✅
const mesasDisponiveis = db.prepare("SELECT id_mesa FROM mesas WHERE disponibilidade = 1").all();
console.log("Mesas disponíveis para reserva:", mesasDisponiveis);

const insertReserva = db.prepare(`
  INSERT INTO reservas (
    data_reserva,
    hora_reserva,
    id_mesa,
    qtd_pessoas,
    contato,
    nome_cliente
  )
  VALUES (?, ?, ?, ?, ?, ?)
`);

//Cadastra novas reservas
/*const novaReserva = [
  '2025-06-01',
  '19:00',
  mesasDisponiveis[1].id_mesa, // Usa um ID de mesa existente
  4,
  '20132131312',
  'Maria da Silva'
];

insertReserva.run(...novaReserva);
console.log('✅ Reserva inserida com sucesso.');*/

//Conferir se a reserva foi vinculada corretamente
const reservasComMesa = db.prepare(` 
  SELECT r.id_reserva, r.nome_cliente, r.id_mesa, m.localidade
  FROM reservas r
  JOIN mesas m ON r.id_mesa = m.id_mesa
`).all();

reservasComMesa.forEach(reserva => {
  console.log(`🔹 Reserva ID: ${reserva.id_reserva}`);
  console.log(`👤 Cliente: ${reserva.nome_cliente}`);
  console.log(`🪑 Mesa ID: ${reserva.id_mesa}`);
  console.log(`📍 Localidade da mesa: ${reserva.localidade}`);
  console.log('---');
});

