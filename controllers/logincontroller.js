const db = require('../models/init-db'); // puxando dados da tabela de usuários

function validateLogin(req, res) {
  const { username, senha } = req.body;

  const stmt = db.prepare('SELECT * FROM usuarios WHERE user_name = ?');
  const usuario = stmt.get(username);

  if (usuario && usuario.senha_usuario === senha) {
    res.status(200).json(usuario); // OK (ainda precisa criptografar senha!)
  } else {
    res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }
}

module.exports = { validateLogin };