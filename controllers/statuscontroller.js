const db = require('../models/init-db');

// Status válidos (devem estar consistentes com o banco de dados)
const VALID_STATUSES = ['pendente', 'confirmada', 'cancelada', 'finalizada'];

// PATCH - Atualiza o status da reserva
function updateStatusReserva(req, res) {
  const idReserva = parseInt(req.params.id, 10);
  const { status } = req.body;

  // Validação do ID
  if (isNaN(idReserva)) {
    return res.status(400).json({ error: 'ID da reserva inválido.' });
  }

  // Validação do status
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Status inválido fornecido.' });
  }

  try {
    // Buscar reserva existente
    const reserva = db.prepare('SELECT * FROM reservas WHERE id_reserva = ?').get(idReserva);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    // Impede alterações se já estiver cancelada ou finalizada
    if (reserva.status === 'cancelada' || reserva.status === 'finalizada') {
      return res.status(403).json({ message: 'Este status não pode mais ser modificado (status final).' });
    }

    // Atualiza o status da reserva
    db.prepare('UPDATE reservas SET status = ? WHERE id_reserva = ?').run(status, idReserva);

    // Se o status for "confirmada", ocupa a mesa (disponibilidade = 0)
    if (status === 'confirmada' && reserva.id_mesa) {
      db.prepare('UPDATE mesas SET disponibilidade = 0 WHERE id_mesa = ?').run(reserva.id_mesa);
    }

    // Se for "cancelada" ou "finalizada", libera a mesa (disponibilidade = 1)
    if ((status === 'cancelada' || status === 'finalizada') && reserva.id_mesa) {
      db.prepare('UPDATE mesas SET disponibilidade = 1 WHERE id_mesa = ?').run(reserva.id_mesa);
    }

    // Resposta de sucesso
    res.json({ message: `Status da reserva ${idReserva} atualizado para "${status}".` });

  } catch (err) {
    // Erro interno
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  updateStatusReserva
};