const express = require('express');
const router = express.Router();
const { validateLogin } = require('../controllers/logincontroller');

router.post('/login', validateLogin); // Está recebendo o id Login do Evento Login, e enviando para rota do Controller(ValidateLogin())

module.exports = router;