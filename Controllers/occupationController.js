const db = require('../Models/init-db');


function confirmarReserva(req, res) {
  const id = req.params.id;
  const { status } = req.body;

  // Validação mínima
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ message: 'Campo "status" é obrigatório e deve ser uma string.' });
  }

  try {
    const update = db.prepare('UPDATE reservas SET status = ? WHERE id_reserva = ?');
    const result = update.run(status, id);

    if (result.changes > 0) {
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