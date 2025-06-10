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