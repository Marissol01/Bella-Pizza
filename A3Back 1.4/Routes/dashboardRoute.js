//CÓDIGO EM REVISÃO

const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../Models/restaurante.db');
const db = new Database(dbPath);

// Informações gerais do dashboard (visão resumida)
router.get('/resumo', (req, res) => {
    try {
        const totalReservas = db.prepare('SELECT COUNT(*) as total FROM reservas').get().total;
        const reservasPendentes = db.prepare("SELECT COUNT(*) as total FROM reservas WHERE status = 'pendente'").get().total;
        const mesasDisponiveis = db.prepare('SELECT COUNT(*) as total FROM mesas WHERE disponibilidade = TRUE').get().total;
        const totalUsuarios = db.prepare('SELECT COUNT(*) as total FROM usuarios').get().total;

        res.json({
            totalReservas,
            reservasPendentes,
            mesasDisponiveis,
            totalUsuarios
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter dados do dashboard.' });
    }
});

// Relatório de reservas por status
router.get('/reservas-status', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT status, COUNT(*) as quantidade
            FROM reservas
            GROUP BY status
        `);
        const resultado = stmt.all();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao gerar relatório de reservas.' });
    }
});

// Relatório de reservas por data (últimos 7 dias)
router.get('/reservas-ultimos-dias', (req, res) => {
    try {
        const stmt = db.prepare(`
            SELECT data_reserva, COUNT(*) as total
            FROM reservas
            WHERE date(data_reserva) >= date('now', '-7 days')
            GROUP BY data_reserva
            ORDER BY data_reserva DESC
        `);
        const resultado = stmt.all();
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar reservas recentes.' });
    }
});

module.exports = router;