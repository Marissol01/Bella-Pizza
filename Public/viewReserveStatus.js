// -------------------------
// Carrega reservas com dropdown de atualização de status
// -------------------------
async function carregarReservasComBotaoDeAtualizacao() {
 
  try {
    const response = await fetch('http://localhost:3000/reservas/visualizar');
    const reservas = await response.json();

    const tbody = document.querySelector('.tabela-reservas tbody');
    tbody.innerHTML = '';

    reservas.forEach(reserva => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id-reserva', reserva.id_reserva);

      let botaoStatus = '';

      if (reserva.status === 'confirmada') {
        botaoStatus = `<button class="confirmacao" data-id="${reserva.id_reserva}" disabled></button>`;
      } else if (reserva.status === 'pendente') {
        botaoStatus = `<button class="confirmacao-pendente" data-id="${reserva.id_reserva}"></button>`;
      } else if (reserva.status === 'cancelada') {
        botaoStatus = `<button class="cancelado" data-id="${reserva.id_reserva}"></button>`;
      } else if (reserva.status === 'finalizada') {
        botaoStatus = `<button class="finalizado" data-id="${reserva.id_reserva}" disabled></button>`;
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

     // ✅ Ativa os listeners nos botões renderizados
      ativarListenersDeStatus(); // chamada permanece aqui

  } catch (error) {
    console.error('Erro ao carregar reservas com botões de atualização:', error);
  }
}