//Arquivo de Consulta ao Banco e Coordenação das requisições das Reservas do Restaurante.db

const express = require('express');
const router = express.Router();
const db = require('../Models/init-db');
const { confirmarReserva } = require('../Controllers/occupationController');
const { cadastrarReserva } = require('../Controllers/cadastroController');
const { cadastrarMesa } = require('../Controllers/adminTable');

//Criar a rota GET para listar reservas
router.get('/', (req, res) => {
  db.all('SELECT * FROM reservas', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Erro ao buscar reservas.' });
    }

    res.json(rows);
  });
});

// Listar reservas por data (ex: para um dia específico)
router.get('/esp', (req, res) => {
  const { data } = req.query;
  if (!data) return res.status(400).json({ erro: 'Data é obrigatória' });

  const stmt = db.prepare(`SELECT * FROM reservas WHERE data_reserva = ?`);
  const reservas = stmt.all(data);

  res.json(reservas);
});

router.post('/confirmar', (req, res) => { //Revisar esta rota ( Está faltando 1 dado)
  const {
    data_reserva,
    hora_reserva,
    id_mesa,
    qtd_pessoas,
    contato,
    nome_cliente
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO reservas (
      data_reserva, hora_reserva, id_mesa, qtd_pessoas,
       contato, nome_cliente
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(data_reserva, hora_reserva, id_mesa, qtd_pessoas, id_usuario, contato, nome_cliente);
    res.status(201).json({ id: info.lastInsertRowid, status: 'Reserva criada' });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

//router.post('/confirmar/:id', confirmarReserva);

router.patch('/:id/confirmar', confirmarReserva);//Redireciona para o Controller de Ocupação de Reserva


router.post('/mesas', cadastrarMesa); //cadastrar mesa
router.post('/cadastrar', cadastrarReserva); //Redireciona para o Controller de Cadastro de Reserva

module.exports = router;

//lembrar de testar essa API post