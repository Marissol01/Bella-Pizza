// SCRIPT VIEW PARA A INTERFACE DE VISUALIZAR RESERVAS CADASTRADAS

// -------------------------
// Função para carregar TODAS as reservas (página "Geral")
// -------------------------
async function carregarReservas() {
  try {
    const response = await fetch('http://localhost:3000/reservas/visualizar');
    const reservas = await response.json();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    reservas.forEach(reserva => {
      const linha = document.createElement('tr');
      linha.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}h</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}h</td>
      `;
      tbody.appendChild(linha);
    });

  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
  }
}

// -------------------------
// Carrega reservas por status: 'pendente', 'confirmada' ou 'cancelado'
// -------------------------
async function carregarReservasPorStatus(status) {
  try {
    const response = await fetch(`http://localhost:3000/reservas/status/${status}`);
    const reservas = await response.json();

    const tbody = document.querySelector('.tabela-reservas tbody');
    tbody.innerHTML = '';

    reservas.forEach(reserva => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id-reserva', reserva.id_reserva);

      let botaoStatus = '';
      if (status === 'confirmada') {
        botaoStatus = `<button class="confirmacao" disabled aria-label="Reserva confirmada"></button>`;
      } else if (status === 'pendente') {
        botaoStatus = `<button class="confirmacao-pendente" data-reserva-id="${reserva.id_reserva}" data-reserva-mesa="${reserva.mesa_reserva}" aria-label="Reserva pendente"></button>`;
      } else if (status === 'cancelado') {
        botaoStatus = `<button class="cancelado" data-reserva-id="${reserva.id_reserva}" data-reserva-mesa="${reserva.mesa_reserva}" aria-label="Reserva cancelada"></button>`;
      }

      tr.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}h</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}h</td>
        <td>${botaoStatus}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao carregar reservas por status:', error);
  }
}


// -------------------------
// Carrega reservas pendentes com botão de cancelar (página cancelar.html)
// -------------------------
async function carregarReservasParaCancelar() {
  try {
    const response = await fetch('http://localhost:3000/reservas/status/pendente');
    const reservas = await response.json();

    const tbody = document.querySelector('.tabela-reservas tbody');
    tbody.innerHTML = '';

    reservas.forEach(reserva => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id-reserva', reserva.id_reserva);

      const botaoCancelar = `<button class="botao-cancelar" aria-label="Cancelar reserva"></button>`;

      tr.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}h</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}h</td>
        <td>${botaoCancelar}</td>
      `;

      tbody.appendChild(tr);
    });

    ativarCancelamento(); // função em outro script

  } catch (error) {
    console.error('Erro ao carregar reservas para cancelar:', error);
  }
}

// -------------------------
// Dispara função correta ao carregar página (conforme classe do <body>)
// -------------------------
window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  if (body.classList.contains('view-geral')) {
    carregarReservas();
  } else if (body.classList.contains('view-confirmadas')) {
    carregarReservasPorStatus('confirmada');
  } else if (body.classList.contains('view-canceladas')) {
    carregarReservasPorStatus('cancelado');
  } else if (body.classList.contains('view-pendentes')) {
    carregarReservasPorStatus('pendente');
  } else if (body.classList.contains('view-pendentes-cancelavel')) {
    carregarReservasParaCancelar();
  } else if (body.classList.contains('view-atualizar-status')) {
    carregarReservasComBotaoDeAtualizacao();
  } else if (body.classList.contains('view-edicao')) {
    carregarReservasParaEdicao(); // você disse que está em outro lugar
  }
});