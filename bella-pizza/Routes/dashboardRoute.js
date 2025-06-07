const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');

// Use todas as rotas definidas no controller (GETs de relatórios)
router.use('/', dashboardController);

module.exports = router;