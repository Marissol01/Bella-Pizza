document.addEventListener('DOMContentLoaded', () => {
  const botao = document.getElementById('emitirRelatorio');
  if (botao) {
    botao.addEventListener('click', async () => {
      try {
        // Calcula hoje e +7 dias
        const hoje = new Date();
        const fim = new Date();
        fim.setDate(hoje.getDate() + 7);

        const formatarData = (data) => data.toISOString().split('T')[0];
        const dataInicio = formatarData(hoje);
        const dataFim = formatarData(fim);

        const url = `/dashboard/relatorios/txt?inicio=${dataInicio}&fim=${dataFim}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Erro ao gerar relatório');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'relatorio.txt';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error('Erro ao baixar relatório:', err);
        alert('Erro ao baixar o relatório. Verifique se o servidor está online.');
      }
    });
  } else {
    console.error('Botão #emitirRelatorio não encontrado no DOM.');
  }
});


async function carregarEstatisticas() {
  try {
    // Buscar dados da API
    const response = await fetch('http://localhost:3000/dashboard/relatorio/estatisticas');
    const dados = await response.json();

    // Preencher total de reservas
     document.querySelector('.total-reserva h2').textContent = `Total de Reservas: ${dados.reservasPorDia.total}`;

    // Preencher reservas por dia, semana e mês
    document.querySelector('.vertical-table .second-column div:nth-child(1) span').textContent = dados.reservasPorPeriodo.dia;
    document.querySelector('.vertical-table .second-column div:nth-child(2) span').textContent = dados.reservasPorPeriodo.semana;
    document.querySelector('.vertical-table .second-column div:nth-child(3) span').textContent = dados.reservasPorPeriodo.mes;

    // Preencher tabela de reservas por dia da semana
    const dia = dados.reservasPorDia; // É um objeto único
    const tabelaRelatorio = document.getElementById('tabela-relatorio');
    tabelaRelatorio.innerHTML = ''; // Limpar tabela existente

    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${dia.domingo}</td>
    <td>${dia.segunda}</td>
    <td>${dia.terca}</td>
    <td>${dia.quarta}</td>
    <td>${dia.quinta}</td>
    <td>${dia.sexta}</td>
    <td>${dia.sabado}</td>
    <td>${dia.total}</td>
`;
    tabelaRelatorio.appendChild(tr);

    // Preencher cancelamentos do mês
    document.querySelector('.cancel-container .cancel h1').textContent = `Cancelamento do mês: ${dados.cancelamentos}`;

  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarEstatisticas);