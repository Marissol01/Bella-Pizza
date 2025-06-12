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

function preencherTabelaReservas(relatorio) { //NÃO FUNCIONA AINDA! LEMBRAR!
  const tabela = document.getElementById('tabela-relatorio');
  tabela.innerHTML = ''; // limpa antes

  relatorio.atendidas.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.id}</td>
      <td>${r.data_reserva}</td>
      <td>${r.hora_reserva}</td>
      <td>${r.cliente}</td>
      <td>${r.id_mesa}</td>
      <td>${r.status}</td>
    `;
    tabela.appendChild(row);
  });

  relatorio.naoAtendidas.forEach(r => {
    const row = document.createElement('tr');
    row.style.backgroundColor = '#ffeeee'; // destacando as não atendidas
    row.innerHTML = `
      <td>${r.id}</td>
      <td>${r.data_reserva}</td>
      <td>${r.hora_reserva}</td>
      <td>${r.cliente}</td>
      <td>${r.id_mesa}</td>
      <td>${r.status}</td>
    `;
    tabela.appendChild(row);
  });

  document.getElementById('info-total').innerText = `Total: ${relatorio.total}`;
  document.getElementById('info-atendidas').innerText = `Atendidas: ${relatorio.totalAtendidas}`;
  document.getElementById('info-nao-atendidas').innerText = `Não Atendidas: ${relatorio.totalNaoAtendidas}`;
}

async function carregarRelatorioReservas() {
  const inicio = '2025-06-01';
  const fim = '2025-06-30';

  try {
    const response = await fetch(`/reservas/relatorio?inicio=${inicio}&fim=${fim}`);
    const data = await response.json();

    if (response.ok) {
      preencherTabelaReservas(data);
    } else {
      console.error('Erro ao buscar o relatório:', data.error);
    }
  } catch (err) {
    console.error('Erro na requisição:', err);
  }
}