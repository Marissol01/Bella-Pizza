//SCRIPT VIEW PARA PESQUISAR RESERVAS CADASTRADAS POR UM FILTRO QUE CONSIDERA (MESA && DATA)
//Lógica = ok!, BackEnd = ok!

// Adiciona um ouvinte de evento de clique ao botão com a classe 'botao-pesquisa'
document.querySelector('.botao-pesquisa').addEventListener('click', async () => {

  const campos = document.querySelectorAll('.campo');
  const numeroMesa = campos[0].value.trim();
  const dataFormatada = campos[1].value.trim();

  if (!numeroMesa || !dataFormatada) {
    alert('Preencha o número da mesa e a data!');
    return;
  }

  // Mapeamento status banco -> classe CSS
  const statusClasses = {
    'pendente': 'confirmacao-pendente',
    'confirmada': 'confirmacao',
    'cancelada': 'cancelado',
    'finalizada': 'finalizado'
  };

  try {
    const response = await fetch(`http://localhost:3000/reservas/filtro?id_mesa=${numeroMesa}&data=${dataFormatada}`);
    const reservas = await response.json();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (reservas.length === 0) {
      const temStatus = document.querySelector('table thead th:nth-child(8)') !== null;
      tbody.innerHTML = `<tr><td colspan="${temStatus ? 8 : 7}">Nenhuma reserva encontrada.</td></tr>`;
      return;
    }

    reservas.forEach(reserva => {
      const linha = document.createElement('tr');

      const temStatus = document.querySelector('table thead th:nth-child(8)') !== null;

      // Busca a classe CSS correta para o status do banco, ou uma padrão
      const classeStatus = statusClasses[reserva.status];

      linha.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}</td>
        ${temStatus ? `<td><button class="${classeStatus}" data-id-reserva="${reserva.id}"></button></td>` : ''}
      `;

      tbody.appendChild(linha);
    });

  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    alert('Erro ao buscar reservas. Tente novamente.');
  }
});