const usuarios = require('../models/usuarios'); // Array simulado de usuários

function validateLogin(req, res) {
  const { username, senha } = req.body;

  const usuario = usuarios.find(
    (u) => u.user_name === username && u.senha_usuario === senha
  );

  if (usuario) {
    res.status(200).json(usuario); // usuário válido
  } else {
    res.status(401).json({ error: 'Usuário ou senha inválidos' }); // erro de autenticação
  }
}

module.exports = { validateLogin };