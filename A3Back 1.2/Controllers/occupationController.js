function confirmarReserva(req, res) {
  const id = req.params.id;
  const db = new Database(dbPath);

  try {
    const update = db.prepare('UPDATE reservas SET status = ? WHERE id_reserva = ?');
    const result = update.run('confirmada', id);

    if (result.changes > 0) {
      res.status(200).json({ message: 'Reserva confirmada com sucesso' });
    } else {
      res.status(404).json({ message: 'Reserva não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao confirmar reserva', error: error.message });
  } finally {
    db.close();
  }
}
module.exports = { confirmarReserva };