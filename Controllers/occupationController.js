const db = require('../models/init-db');


function confirmarReserva(req, res) {
  const id = req.params.id;
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({ message: 'Campo "status" é obrigatório e deve ser uma string.' });
  }

  try {
    // Atualiza o status da reserva
    const updateReserva = db.prepare('UPDATE reservas SET status = ? WHERE id_reserva = ?');
    const result = updateReserva.run(status, id);

    if (result.changes > 0) {
      // Agora busca a mesa associada a essa reserva
      const reserva = db.prepare('SELECT id_mesa FROM reservas WHERE id_reserva = ?').get(id);
      const idMesa = reserva?.id_mesa;

      // Se for uma confirmação, torna a mesa indisponível
      if (status.toLowerCase() === 'confirmada' && idMesa) {
        const updateMesa = db.prepare('UPDATE mesas SET disponibilidade = 0 WHERE id_mesa = ?');
        updateMesa.run(idMesa);
      }

      res.status(200).json({ message: 'Reserva atualizada com sucesso' });
    } else {
      res.status(404).json({ message: 'Reserva não encontrada' });
    }

  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar reserva', error: error.message });
  }
}
module.exports = { confirmarReserva };