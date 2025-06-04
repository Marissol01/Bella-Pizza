//SCRIPT VIEW PARA PESQUISAR RESERVAS CADASTRADAS POR UM FILTRO QUE CONSIDERA (MESA && DATA)
//Lógica = ok!, BackEnd = ok!

document.querySelector('.botao-pesquisa').addEventListener('click', async () => {
  const campos = document.querySelectorAll('.campo');
  const numeroMesa = campos[0].value.trim();
  const dataDigitada = campos[1].value.trim();

  if (!numeroMesa || !dataDigitada) {
    alert('Preencha o número da mesa e a data!');
    return;
  }

  // Converte "DD/MM/AAAA" para "AAAA-MM-DD"
  const [dia, mes, ano] = dataDigitada.split('/');
  const dataFormatada = `${ano}-${mes}-${dia}`;

  try {
    const response = await fetch(`http://localhost:3000/reservas/filtro?id_mesa=${numeroMesa}&data=${dataFormatada}`);
    const reservas = await response.json();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Nenhuma reserva encontrada.</td></tr>';
      return;
    }

    reservas.forEach(reserva => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}</td>
      `;

      tbody.appendChild(linha);
    });
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    alert('Erro ao buscar reservas. Tente novamente.');
  }
});