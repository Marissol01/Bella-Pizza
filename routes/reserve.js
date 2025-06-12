//Arquivo de Consulta ao Banco e Coordenação das requisições das Reservas do Restaurante.db

const express = require('express');
const router = express.Router();
const db = require('../models/init-db');
const { confirmarReserva } = require('../controllers/occupationcontroller');
const { cadastrarReserva } = require('../controllers/cadastrocontroller');
const { cadastrarMesa } = require('../controllers/admintable');
const { listarReservas, buscarPorMesaEData, visualizarReservasPorStatus } = require('../controllers/viewcontroller');
//JULIANA EM 07/06:
const { cancelarReserva } = require('../controllers/cancelarcontroller');//JULIANA EM 07/06:
//Amós 07/06/2025
const { updateStatusReserva} = require('../controllers/statuscontroller');

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

//router.post('/confirmar/:id', confirmarReserva);

router.patch('/:id/confirmar', confirmarReserva);//Redireciona para o Controller de Ocupação de Reserva


router.post('/mesas', cadastrarMesa); //cadastrar mesa
router.post('/cadastrar', cadastrarReserva); //Redireciona para o Controller de Cadastro de Reserva
router.get('/visualizar', listarReservas); // Pega os dados das reservas cadastradas, e cria uma nova linha na interface "visualizar reservas"
router.get('/status/:status', visualizarReservasPorStatus);// Rota dinâmica que busca reservas de acordo com o status ('confirmada', 'cancelada', 'pendente') passado na URL
router.get('/filtro', buscarPorMesaEData);// Busca reservas com base na mesa e data (útil para evitar conflitos de agendamento)

//JULIANA EM 07/06:
router.patch('/:id/cancelar', cancelarReserva); //Redireciona para o Controller de cancelar Reserva
//Amós 07/06:
router.put('/:id/status', updateStatusReserva);

module.exports = router;

//lembrar de testar essa API post