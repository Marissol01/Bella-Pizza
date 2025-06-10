const db = require('../Models/init-db');

//Lógica para cadastro de nóvas mesas
function cadastrarMesa(req, res) {
  const { capacidade, localidade, disponibilidade } = req.body;

  // Validações básicas para inserção na tabela mesas
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

// Lógica para listar mesas no Select do Front ✅
function listarMesas(req, res) {
  try {
    const stmt = db.prepare('SELECT id_mesa AS id, capacidade FROM mesas WHERE disponibilidade = 1');
    const mesas = stmt.all();
    res.json(mesas);
  } catch (error) {
    console.error('Erro ao listar mesas disponíveis:', error);
    res.status(500).json({ erro: 'Erro ao buscar mesas disponíveis ' });
  }
}

module.exports = {
  cadastrarMesa,
  listarMesas
};