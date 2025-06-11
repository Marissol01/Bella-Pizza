const db = require('../models/init-db');

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

// Função responsável por buscar reservas com base em um status específico (ex: 'confirmada', 'cancelada', 'pendente').
//ESTA FUNÇÃO AINDA NÃO ESTÁ SENDO IMPLEMENTADA NO FRONT
function visualizarReservasPorStatus(req, res) {
  try {
    // Extrai o parâmetro 'status' da rota (ex: /reservas/status/confirmada → status = 'confirmada')
    const status = req.params.status;

    // Prepara a instrução SQL para buscar todas as reservas com o status informado,
    // unindo com a tabela de mesas para garantir que a mesa está disponível (disponibilidade = 1).
    const stmt = db.prepare(`
      SELECT 
        r.id_reserva,
        r.id_mesa,
        r.nome_cliente,
        r.data_reserva,
        r.hora_reserva,
        r.duracao_reserva,
        r.qtd_pessoas,
        r.contato,
        r.status
      FROM reservas r
      JOIN mesas m ON r.id_mesa = m.id_mesa
      WHERE r.status = ? 
      ORDER BY r.data_reserva, r.hora_reserva
    `);

    // Executa a consulta usando o valor do status como parâmetro
    const reservas = stmt.all(status);

    // Retorna as reservas encontradas em formato JSON com status 200 (OK)
    res.status(200).json(reservas);

  } catch (err) {
    // Caso ocorra algum erro durante a execução da consulta, exibe o erro no console
    // e retorna uma resposta com status 500 (erro interno)
    console.error('Erro ao buscar reservas:', err);
    res.status(500).json({ error: 'Erro interno ao buscar reservas.' });
  }
}
module.exports = {
  listarReservas,
  buscarPorMesaEData,
  visualizarReservasPorStatus
};