const express = require('express');
const cors = require('cors');
const app = express();
const loginRoute = require('./Routes/loginRoute');
const indexRoutes = require('./Routes/index');
const dashboardRoutes = require('./Routes/dashboardRoute');
const tableRoutes = require('./Routes/tableRoute');
const reservaRoutes = require('./Routes/Reserve');


app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos HTML, CSS, JS

// Revisar a definição das rotas no parãmetro
app.use('/', indexRoutes);
app.use('/api', loginRoute); 
app.use('/dashboard', dashboardRoutes);
app.use('/mesas', tableRoutes);
app.use('/reservas',reservaRoutes);


app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});