//CÓDIGO EM REVISÃO DashboardController

const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../Models/restaurante.db');
// A emissão de relatórios precisa especificamente da conexão com restaurante.db
const db = new Database(dbPath);

// Relatório de Reservas por Período
router.get('/relatorio-reservas', (req, res) => {
    const { inicio, fim } = req.query;

    if (!inicio || !fim) {
        return res.status(400).json({ error: 'Por favor, informe as datas de início e fim no formato YYYY-MM-DD.' });
    }

    try {
        const stmt = db.prepare(`
    SELECT 
        r.id_reserva AS id, 
        r.data_reserva, 
        r.hora_reserva, 
        r.status, 
        r.id_mesa, 
        r.nome_cliente AS cliente
    FROM reservas r
    WHERE date(r.data_reserva) BETWEEN date(?) AND date(?)
    ORDER BY r.data_reserva, r.hora_reserva
`);

        const reservas = stmt.all(inicio, fim);

        const atendidas = reservas.filter(r => ['atendida', 'confirmada'].includes(r.status.toLowerCase()));
        const naoAtendidas = reservas.filter(r => ['cancelada', 'pendente'].includes(r.status.toLowerCase()));

        const total = reservas.length;
        const totalAtendidas = atendidas.length;
        const totalNaoAtendidas = naoAtendidas.length;

        res.json({
            periodo: { inicio, fim },
            atendidas,
            naoAtendidas,
            total,
            totalAtendidas,
            totalNaoAtendidas
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar relatório de reservas.' });
    }
});

// Histórico de Reservas por Mesa
router.get('/historico-mesa/:mesaId', (req, res) => {
    const mesaId = parseInt(req.params.mesaId);

    if (isNaN(mesaId)) {
        return res.status(400).json({ error: 'ID da mesa inválido.' });
    }

    try {
        const stmtHistorico = db.prepare(`
            SELECT 
                r.data_reserva, 
                r.hora_reserva, 
                r.nome_cliente AS cliente, 
                r.qtd_pessoas, 
                r.status
            FROM reservas r
            WHERE r.id_mesa = ?
            ORDER BY r.data_reserva DESC, r.hora_reserva DESC
        `);

        const stmtProxima = db.prepare(`
            SELECT 
                r.data_reserva, 
                r.hora_reserva, 
                r.nome_cliente AS cliente, 
                r.qtd_pessoas, 
                r.status
            FROM reservas r
            WHERE r.id_mesa = ? AND date(r.data_reserva) > date('now')
            ORDER BY r.data_reserva ASC, r.hora_reserva ASC
            LIMIT 1
        `);

        const historico = stmtHistorico.all(mesaId);  // <-- faltava aqui
        const proxima = stmtProxima.get(mesaId);

        res.json({
            mesaId,
            historico,
            proxima
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar histórico da mesa.' });
    }
});


module.exports = router;