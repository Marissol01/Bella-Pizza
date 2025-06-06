//SCRIPT VIEW PARA A INTERFACE DE VISUALIZAR RESERVAS CADASTRADAS
//Lógica = ok! ; BackEnd = Ok!

// Função que busca todas as reservas no servidor e exibe na tabela da página geral (view-geral)
async function carregarReservas() {
  try {
    // Faz requisição para obter todas as reservas
    const response = await fetch('http://localhost:3000/reservas/visualizar');
    const reservas = await response.json();

    // Seleciona o corpo da tabela onde as reservas serão exibidas
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // limpa conteúdo anterior

    // Para cada reserva retornada, cria uma linha na tabela com as informações básicas
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

// Armazena o contexto da página via data-atributo no body (não utilizado diretamente no código atual)
const contexto = document.body.dataset.contexto;

// Função para visualizar reservas filtradas por status específico (confirmada, cancelada, pendente)
// Recebe o parâmetro "status" para definir qual grupo de reservas carregar
async function carregarReservasPorStatus(status) {
  try {
    // Requisição para a API buscando reservas que correspondem ao status
    const response = await fetch(`http://localhost:3000/reservas/status/${status}`);
    const reservas = await response.json();

    // Seleciona o tbody da tabela onde as reservas serão exibidas
    const tbody = document.querySelector('.tabela-reservas tbody');
    tbody.innerHTML = ''; // Limpa tabela

    // Itera sobre as reservas retornadas
    reservas.forEach(reserva => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id-reserva', reserva.id_reserva);

      // Variável para armazenar o botão correspondente ao status da reserva
      let botaoStatus = '';

      // Define o botão de ação com base no status da reserva
      if (status === 'confirmada') {
        // Botão desabilitado indicando que a reserva está confirmada
        botaoStatus = `<button class="confirmacao" disabled aria-label="Reserva confirmada"></button>`;
      } else if (status === 'pendente' ) {
        // Botão para reserva pendente, pode permitir ação (ex: confirmar)
        botaoStatus = `<button class="confirmacao-pendente" data-reserva-id="${reserva.id_reserva}" aria-label="Reserva pendente"></button>`;
      } else if (status === 'cancelado') {
        // Botão para reserva cancelada, possível ação de visualização ou outra
        botaoStatus = `<button class="cancelado" data-reserva-id="${reserva.id_reserva}" aria-label="Reserva cancelada"></button>`; 
      }

      // Monta a linha da tabela com os dados da reserva e o botão de status
      tr.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}h</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}h</td>
        <td>
          ${botaoStatus}
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erro ao carregar reservas por status:', error);
  }
}


// e chama a função adequada para carregar as reservas conforme a página atual
//Aqui voces podem escalar conforme voces precisarem
window.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // A lógica usa classes específicas no body para identificar qual view está ativa
  if (body.classList.contains('view-geral')) {
    // Página geral: carrega todas as reservas
    carregarReservas();
  } else if (body.classList.contains('view-confirmadas')) {
    // Página de reservas confirmadas
    carregarReservasPorStatus('confirmada');
  } else if (body.classList.contains('view-canceladas')) {
    // Página de reservas canceladas
    carregarReservasPorStatus('cancelado');
  } else if (body.classList.contains('view-pendentes')) {
    // Página de reservas pendentes
    carregarReservasPorStatus('pendente');
  } else if (body.classList.contains('view-pendentes-cancelavel')) {
    // Página de reservas pendentes que podem ser canceladas
    carregarReservasParaCancelar();
  } else if (body.classList.contains('view-edicao')) {
    // Página para edição de reservas (função deve estar definida em outro lugar)
    carregarReservasParaEdicao();
  }
});

// Função para carregar as reservas cadastradas pendentes, na página cancelar.HTML
async function carregarReservasParaCancelar() {
  try {
    // Busca reservas pendentes da API
    const response = await fetch('http://localhost:3000/reservas/status/pendente');
    const reservas = await response.json();

    // Seleciona tbody para exibir as reservas
    const tbody = document.querySelector('.tabela-reservas tbody');
    tbody.innerHTML = ''; // limpa tabela

    // Para cada reserva cria uma linha com as informações e botão para cancelar
    reservas.forEach(reserva => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id-reserva', reserva.id_reserva);

      // Botão para cancelar a reserva
      const botaoCancelar = `<button class="botao-cancelar" aria-label="Cancelar reserva"></button>`;

      tr.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}h</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}h</td>
        <td>
          ${botaoCancelar}
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Ativa os eventos de cancelamento (função definida em "cancelar.js")
    ativarCancelamento();
   

  } catch (error) {
    console.error('Erro ao carregar reservas para cancelar:', error);
  }
}