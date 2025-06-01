//REVISAR CÓDIGO

 const express = require('express');
const router = express.Router();
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../Models/restaurante.db');
const { cadastrarMesa } = require('../Controllers/adminTable'); 
const db = new Database(dbPath);



// Listar todas as mesas
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM mesas');
        const mesas = stmt.all();
        res.json(mesas);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar mesas.' });
    }
});

// Listar mesas disponíveis
router.get('/disponiveis', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM mesas WHERE disponibilidade = TRUE');
        const mesasDisponiveis = stmt.all();
        res.json(mesasDisponiveis);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar mesas disponíveis.' });
    }
});

// Atualizar status de disponibilidade de uma mesa
router.put('/:id/disponibilidade', (req, res) => {
    const { id } = req.params;
    const { disponibilidade } = req.body;

    if (disponibilidade === undefined) {
        return res.status(400).json({ error: 'Campo "disponibilidade" é obrigatório.' });
    }

    try {
        const stmt = db.prepare('UPDATE mesas SET disponibilidade = ? WHERE id_mesa = ?');
        const result = stmt.run(disponibilidade, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Mesa não encontrada.' });
        }

        res.json({ message: 'Disponibilidade atualizada com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar disponibilidade.' });
    }
});

// Criar nova mesa
router.post('/', cadastrarMesa);

module.exports = router;