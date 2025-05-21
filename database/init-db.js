// database/init-db.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'restaurante.db');
const db = new Database(dbPath);

// Criação das tabelas
db.exec(`
CREATE TABLE IF NOT EXISTS mesas (
    id_mesa INTEGER PRIMARY KEY,
    capacidade INTEGER NOT NULL CHECK (capacidade > 0),
    localidade TEXT NOT NULL,
    disponibilidade BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    numero_telefone TEXT,
    email TEXT UNIQUE,
    data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP,
    user_name TEXT UNIQUE NOT NULL,
    senha_usuario TEXT NOT NULL,
    tipo_funcionario TEXT NOT NULL CHECK (tipo_funcionario IN ('Atendente', 'Garçom', 'Gerente'))
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
    data_reserva TEXT NOT NULL, 
    hora_reserva TEXT NOT NULL,
    id_mesa INTEGER NOT NULL,
    qtd_pessoas INTEGER NOT NULL CHECK (qtd_pessoas > 0),
    id_usuario INTEGER NOT NULL,
    contato TEXT NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'finalizada')),
    nome_cliente TEXT NOT NULL,
    datahora_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
    duracao_reserva INTEGER DEFAULT 120,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
`);

console.log('Tabelas criadas com sucesso!');
db.close();