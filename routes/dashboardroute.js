const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardcontroller');

// Reutilize o mesmo nome abaixo
router.get('/relatorio-reservas', dashboardController.gerarRelatorioReservas);
router.get('/historico-mesa', dashboardController.obterHistoricoPorMesa);
router.get('/mesas-confirmadas', dashboardController.listarMesasPorGarcom);
router.get('/relatorios/txt', dashboardController.emitirRelatorioTxt);
module.exports = router;


