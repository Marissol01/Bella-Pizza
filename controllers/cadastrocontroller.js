const db = require('../models/init-db');

// Função que Cadastra Novas Reservas
function cadastrarReserva(req, res) {
  const {
    mesa,        // ID da mesa
    nome,        // nome do cliente
    data,        // data da reserva
    contato,     // telefone
    tempo,       // duração da reserva (em minutos)
    horario,     // horário da reserva (ex: "19:30")
    quantidade   // número de pessoas
  } = req.body;

  console.log("Body recebido:", req.body);

  //Funciona corretamente
  if (!nome || nome.trim() === "" ||
    !data || data.trim() === "" ||
    !contato || contato.trim() === "") {
    return res.status(400).json({ error: 'Nome, data e contato são obrigatórios.' });
  }

  const mesaID = parseInt(mesa, 10);

  if (isNaN(mesaID)) {
    return res.status(400).json({ error: 'ID da mesa inválido.' });
  }

  try {
    db.prepare('BEGIN').run();

    const mesaInfo = db.prepare(`
      SELECT capacidade, disponibilidade 
      FROM mesas 
      WHERE id_mesa = ?
    `).get(mesaID);

    if (!mesaInfo) {
      db.prepare('ROLLBACK').run();
      return res.status(404).json({ error: 'Mesa não encontrada.' });
    }

    if (mesaInfo.disponibilidade !== 1) {
      db.prepare('ROLLBACK').run();
      return res.status(400).json({ error: 'Mesa indisponível no momento.' });
    }

    if (quantidade > mesaInfo.capacidade) {
      db.prepare('ROLLBACK').run();
      return res.status(400).json({
        error: `A mesa suporta no máximo ${mesaInfo.capacidade} pessoas.`
      });
    }

    // Inserção de reserva corrigida??
    const reservaStmt = db.prepare(`
      INSERT INTO reservas (
        id_mesa, nome_cliente, data_reserva, duracao_reserva, qtd_pessoas, hora_reserva, contato
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = reservaStmt.run(
      mesaID,
      nome,
      data,
      parseInt(tempo),     // duração em minutos
      parseInt(quantidade),
      horario,             // horário ex: "19:30"
      contato
    );

    db.prepare('COMMIT').run();

    return res.status(201).json({
      message: 'Reserva cadastrada com sucesso!',
      id_reserva: info.lastInsertRowid
    });

  } catch (err) {
    console.error('Erro ao cadastrar reserva:', err);
    db.prepare('ROLLBACK').run();
    return res.status(500).json({ error: 'Erro interno ao cadastrar reserva.' });
  }
}

module.exports = { cadastrarReserva };
