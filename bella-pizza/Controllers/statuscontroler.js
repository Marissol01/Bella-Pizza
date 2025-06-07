
const sqlite3 = require('sqlite3').verbose();

let db;

function initDb(databasePath) {
    db = new sqlite3.Database(databasePath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados em updatestatuscontroler:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite via updatestatuscontroler.');
        }
    });

    // Opcional: Criar a tabela se não existir
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS reservas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_reserva TEXT NOT NULL,
                status TEXT NOT NULL
            )
        `);
        // Inserir dados de exemplo se a tabela estiver vazia (para teste)
        db.get("SELECT COUNT(*) AS count FROM reservas", (err, row) => {
            if (err) {
                console.error("Erro ao verificar reservas:", err.message);
                return;
            }
            if (row.count === 0) {
                console.log("Inserindo reservas de exemplo...");
                db.run("INSERT INTO reservas (nome_reserva, status) VALUES ('Reserva Mesa 1', 'confirmacao-pendente')");
                db.run("INSERT INTO reservas (nome_reserva, status) VALUES ('Reserva Sala VIP', 'confirmacao')");
                db.run("INSERT INTO reservas (nome_reserva, status) VALUES ('Reserva Evento A', 'cancelado')");
                db.run("INSERT INTO reservas (nome_reserva, status) VALUES ('Reserva Evento B', 'finalizado')");
                console.log("Reservas de exemplo inseridas.");
            }
        });
    });
}

// Lista de status válidos (deve ser a mesma do frontend)
const VALID_STATUSES = [
    "confirmacao-pendente",
    "confirmacao",
    "cancelado",
    "finalizado"
];

// Função para obter todas as reservas
async function getReservas(req, res) {
    const sql = 'SELECT id, nome_reserva, status FROM reservas ORDER BY id';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
}

// Função para atualizar o status de uma reserva específica
async function updateStatusReserva(req, res) {
    const reservaId = req.params.id; // ID da reserva da URL
    const { status } = req.body;     // Novo status do corpo da requisição

    // 1. Validação do Status
    if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Status inválido fornecido.' });
    }

    // 2. Lógica de Negócio: Impedir mudança de status "finalizado" ou "cancelado"
    db.get('SELECT status FROM reservas WHERE id = ?', [reservaId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Reserva não encontrada.' });
        }

        const currentStatus = row.status;

        if (currentStatus === 'finalizado' || currentStatus === 'cancelado') {
            return res.status(403).json({ message: 'Este status não pode mais ser modificado (status final).' });
        }

        // 3. Atualizar no Banco de Dados
        const sql = 'UPDATE reservas SET status = ? WHERE id = ?';
        db.run(sql, [status, reservaId], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                // Nenhuma linha foi alterada (ID não existe ou status já era o mesmo)
                return res.status(404).json({ message: 'Reserva não encontrada ou o status já era o mesmo.' });
            }
            res.json({ message: `Status da reserva ${reservaId} atualizado para "${status}".` });
        });
    });
}

// Exporta as funções para serem usadas pelo servidor Express
module.exports = {
    initDb,
    getReservas,
    updateStatusReserva
};