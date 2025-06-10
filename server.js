const express = require('express');
const cors = require('cors');
const app = express();

const loginRoute = require('./Routes/loginRoute');
const indexRoutes = require('./Routes/index');
const tableRoutes = require('./Routes/tableRoute');
const reservaRoutes = require('./Routes/Reserve');
const dashboardRoutes = require('./Routes/dashboardRoute'); 

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
