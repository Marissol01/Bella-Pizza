const db = require('../Models/init-db');

//Função que Cadastra Novas Reservas
function cadastrarReserva(req, res) {
  const {
    mesa,        // ID da mesa
    nome,        // nome do cliente
    data,        // data da reserva
    contato,     // telefone
    tempo,       // hora da reserva
    quantidade   // número de pessoas
  } = req.body;

  console.log("Body recebido:", req.body);
  const mesaID = parseInt(mesa, 10); // tratando dados numéricos em base decimal

  if (isNaN(mesaID)) {
    return res.status(400).json({ error: 'ID da mesa inválido.' });
  }

  try {
    // 🔹 Inicia a transação: Transação segura com BEGIN, COMMIT e ROLLBACK:
    //    Isso evita inconsistências no banco (ex: inserir uma reserva mesmo com dados inválidos).
    db.prepare('BEGIN').run();

    // 🔍 Verifica se a mesa existe, está disponível e tem capacidade suficiente
    const mesaInfo = db.prepare(`
      SELECT capacidade, disponibilidade 
      FROM mesas 
      WHERE id_mesa = ?
    `).get(mesaID);

    // 🔍 Condições que verificam se estes requisitos foram atendidos
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

    // ✅ Inserção da reserva
    const reservaStmt = db.prepare(`
      INSERT INTO reservas (
        id_mesa, nome_cliente, data_reserva, hora_reserva, qtd_pessoas, contato
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = reservaStmt.run(mesaID, nome, data, tempo, quantidade, contato);

    // 🔒 Finaliza a transação
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
