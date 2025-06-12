//RESPONSÁVEL POR ATUALIZAR STATUS DE RESERVA
//LÓGICA = OK , API BACKEND = ok!!

//método necessário para dar um Map nos nomes das classes CSS, para os nomes corretos definidos na tabela do Banco de Dados
const statusMap = {
  'confirmacao-pendente': 'pendente',
  'confirmacao': 'confirmada',
  'cancelado': 'cancelada',
  'finalizado': 'finalizada'
};

document.addEventListener('DOMContentLoaded', async () => {
    await carregarReservasComBotaoDeAtualizacao();
    ativarListenersDeStatus();
});

//Função responsável por abrir um modal, que me permita Selecionar o Status que eu desejar
function ativarListenersDeStatus() {
    console.log('Listeners ativados!');
    const modal = document.getElementById("modal-editar");
    const botoesStatus = modal.querySelectorAll(".status-opcao");
    const botaoConfirmar = modal.querySelector(".confirmar");
    const botaoFechar = modal.querySelector("#fechar-modal");
    const statusClasses = Object.keys(statusMap); // ['confirmacao-pendente', 'confirmacao', 'cancelado', 'finalizado']

    let botaoAtual = null;
    let novoStatusClasse = null;

    // Abrir modal ao clicar no botão de status
    document.querySelector(".tabela-reservas tbody").addEventListener("click", (event) => {
        console.log("Clique detectado no tbody");
        const botao = event.target;

        if (statusClasses.some(cls => botao.classList.contains(cls))) {
            if (botao.classList.contains("finalizado") || botao.classList.contains("cancelado")) {
                alert("Este status não pode mais ser modificado.");
                return;
            }

            botaoAtual = botao;
            novoStatusClasse = null;
            botoesStatus.forEach(btn => btn.classList.remove("selecionado"));
            modal.style.display = "flex";
        }
    });

    // Selecionar novo status no modal
    botoesStatus.forEach(botao => {
        botao.addEventListener("click", () => {
            botoesStatus.forEach(btn => btn.classList.remove("selecionado"));
            botao.classList.add("selecionado");
            novoStatusClasse = botao.dataset.status;
        });
    });

    // Confirmar alteração
    botaoConfirmar.addEventListener('click', () => {
        if (botaoAtual && novoStatusClasse) {
            const reservaId = botaoAtual.dataset.id;
            const statusParaAPI = statusMap[novoStatusClasse]; // Aqui converte para valor aceito pela API

            console.log("ID da reserva:", reservaId);
            console.log("Enviando status:", statusParaAPI);

            fetch(`/reservas/${reservaId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: statusParaAPI })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                statusClasses.forEach(cls => botaoAtual.classList.remove(cls));
                botaoAtual.classList.add(novoStatusClasse);
                modal.style.display = 'none';
                console.log(data.message);
            })
            .catch(err => {
                alert(`Erro ao atualizar status: ${err.message || 'Erro desconhecido.'}`);
            });
        }
    });

    // Fechar o modal
    botaoFechar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}