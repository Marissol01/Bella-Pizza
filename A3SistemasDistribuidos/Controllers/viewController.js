const db = require('../Models/init-db');

// Função que retorna todas as reservas
function listarReservas(req, res) {
  try {
    const stmt = db.prepare(`
      SELECT 
        id_reserva,
        id_mesa,
        nome_cliente,
        data_reserva,
        hora_reserva,
        duracao_reserva,
        qtd_pessoas,
        contato,
        status
      FROM reservas
      ORDER BY data_reserva, hora_reserva
    `);

    const reservas = stmt.all();

    res.status(200).json(reservas);
  } catch (err) {
    console.error('Erro ao buscar reservas:', err);
    res.status(500).json({ error: 'Erro interno ao buscar reservas.' });
  }
}

//Função responsável pela pesquisa filtrada
function buscarPorMesaEData(req, res) {
  const { id_mesa, data } = req.query;

  if (!id_mesa || !data) {
    return res.status(400).json({ error: 'Informe o id da mesa e a data.' });
  }

  try {
    const stmt = db.prepare(`
      SELECT 
        id_reserva,
        id_mesa,
        nome_cliente,
        data_reserva,
        hora_reserva,
        duracao_reserva,
        qtd_pessoas,
        contato,
        status
      FROM reservas
      WHERE id_mesa = ? AND data_reserva = ?
      ORDER BY hora_reserva
    `);

    const reservas = stmt.all(id_mesa, data);
    res.status(200).json(reservas);
  } catch (err) {
    console.error('Erro ao buscar reservas filtradas:', err);
    res.status(500).json({ error: 'Erro interno ao buscar reservas.' });
  }
}

module.exports = {
  listarReservas,
  buscarPorMesaEData
};