//LEMBRAR DE CORRIGIR!!

//--------------JULIANA EM 07/06
const db = require('../models/init-db');

function cancelarReserva(req, res) {
  const { id_reserva, id_mesa } = req.body;

  console.log("Requisição recebida:", req.body);

  try {
    // Inicia transação
    db.prepare('BEGIN TRANSACTION').run();

    // Atualiza status da reserva
    db.prepare(`
      UPDATE reservas 
      SET status = 'cancelada' 
      WHERE id_reserva = ?
    `).run(id_reserva);

    // Atualiza disponibilidade da mesa
    db.prepare(`
      UPDATE mesas 
      SET disponibilidade = 1 
      WHERE id_mesa = ?
    `).run(id_mesa);

    // Confirma transação
    db.prepare('COMMIT').run();

    res.json({
      sucesso: true,
      mensagem: 'Reserva e mesa atualizadas com sucesso'
    });

  } catch (error) {
    // Reverte transação em caso de erro
    db.prepare('ROLLBACK').run();
    console.error('Erro no cancelamento:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: error.message
    });
  }
}

module.exports = { cancelarReserva };