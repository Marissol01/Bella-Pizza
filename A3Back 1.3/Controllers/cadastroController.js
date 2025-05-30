const db = require('../Models/init-db');


function cadastrarReserva(req, res) {
  const {
    mesa,
    nome,
    data,
    contato,
    tempo,
    quantidade
  } = req.body;

  const stmt = db.prepare('BEGIN TRANSACTION');

  console.log("Body recebido:", req.body);
  console.log("Mesa recebida do front:", mesa)
try {
 const mesaID = parseInt(mesa, 10);
if (isNaN(mesaID)) {
  return res.status(400).json({ error: 'ID da mesa inválido.' });
}

const mesaExiste = db.prepare('SELECT 1 FROM mesas WHERE id_mesa = ?').get(mesaID);
console.log("Mesa existe:", mesaExiste);


  // Código para inserir a reserva
  const reservaStmt = db.prepare(`
    INSERT INTO reservas (
      id_mesa, nome_cliente, data_reserva, hora_reserva, qtd_pessoas, contato
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = reservaStmt.run(mesa, nome, data, tempo, quantidade, contato);
  
  stmt.run('COMMIT');
  return res.status(201).json({
    message: 'Reserva cadastrada com sucesso!',
    id_reserva: info.lastInsertRowid
  });
} catch (err) {
  stmt.run('ROLLBACK');
  res.status(500).json({ error: 'Erro interno ao cadastrar reserva.' });
}
}
module.exports = { cadastrarReserva };
