const express = require('express');
const cors = require('cors');
const app = express();

const loginRoute = require('./routes/loginroute');
const indexRoutes = require('./routes/index');
const tableRoutes = require('./routes/tableroute');
const reservaRoutes = require('./routes/reserve');
const dashboardRoutes = require('./routes/dashboardroute'); 

const port = process.env.PORT || 3000; //para configurar a Variável de Ambiente

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos HTML, CSS, JS

// Revisar a definição das rotas no parâmetro
app.use('/', indexRoutes);
app.use('/api', loginRoute); 
app.use('/mesas', tableRoutes);
app.use('/reservas', reservaRoutes);
app.use('/dashboard', dashboardRoutes); // <-- Adicione isso!

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
