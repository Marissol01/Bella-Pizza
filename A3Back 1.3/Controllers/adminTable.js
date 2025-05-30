const db = require('../Models/init-db');


function cadastrarMesa(req, res) {
  const { capacidade, localidade, disponibilidade } = req.body;

  // Validações básicas
  if (!capacidade || capacidade <= 0 || !localidade) {
    return res.status(400).json({ error: 'Capacidade e localidade são obrigatórios e válidos.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO mesas (capacidade, localidade, disponibilidade)
      VALUES (?, ?, ?)
    `);

    const info = stmt.run(capacidade, localidade, disponibilidade ?? true); // default true

    res.status(201).json({
      message: 'Mesa cadastrada com sucesso.',
      id_mesa: info.lastInsertRowid
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar mesa.' });
  }
}

module.exports = { cadastrarMesa };