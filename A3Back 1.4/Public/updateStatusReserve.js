//LÓGICA = OK , API BACKEND = Revisar 


const botoesEditar = document.querySelectorAll('.confirmacao-pendente, .confirmacao, .cancelado, .finalizado');

const modal = document.getElementById('modal-editar');
const fechar = document.getElementById('fechar-modal');
const botaoConfirmar = document.querySelector('.confirmar');

let botaoAtual = null;
let novoStatusClasse = null;

const statusClasses = [
    "confirmacao-pendente",
    "confirmacao",
    "cancelado",
    "finalizado"
];

const botoesStatus = document.querySelectorAll('.status-opcao');

// Abrir o modal
botoesEditar.forEach(botao => {
    botao.addEventListener('click', () => {
        // Impede mudanças se status já for final ou cancelado
        if (botao.classList.contains('finalizado') || botao.classList.contains('cancelado')) {
            alert('Este status não pode mais ser modificado.');
            return;
        }

        botaoAtual = botao;
        novoStatusClasse = null;
        botoesStatus.forEach(btn => btn.classList.remove('selecionado'));
        modal.style.display = 'flex';
    });
});

// Seleciona novo status dentro do modal
botoesStatus.forEach(btn => {
    btn.addEventListener('click', () => {
        botoesStatus.forEach(b => b.classList.remove('selecionado'));
        btn.classList.add('selecionado');
        novoStatusClasse = btn.dataset.status;
    });
});

// Confirma a mudança de status
botaoConfirmar.addEventListener('click', () => {
    if (botaoAtual && novoStatusClasse) {
        // Remove todas as classes anteriores
        statusClasses.forEach(cls => botaoAtual.classList.remove(cls));
        // Aplica a nova classe
        botaoAtual.classList.add(novoStatusClasse);
        modal.style.display = 'none';
    }
});

// Fecha o modal com o botão voltar
fechar.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fecha o modal clicando fora dele
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});