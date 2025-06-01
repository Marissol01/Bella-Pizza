//LÓGICA = OK ; API BACKEND = Revisar

const botoesEditar = document.querySelectorAll('.confirmacao-pendente');
const modal = document.getElementById('modal-editar');
const fechar = document.getElementById('fechar-modal');
const confirmar = document.getElementById('confirmar-modal');

let idReservaSelecionada = null;
let botaoAtual = null;

// Abre o modal e armazena o ID da reserva e o botão clicado
botoesEditar.forEach(botao => {
  botao.addEventListener('click', () => {
    idReservaSelecionada = botao.dataset.reservaId; // o botão precisa ter data-reserva-id="123"

    if (botao.classList.contains('confirmacao')) return; // impede abrir o modal se a reserva já estiver confirmada
    botaoAtual = botao;
    modal.style.display = 'flex';
  });
});

// Fecha o modal ao clicar no X
fechar.addEventListener('click', () => {
  modal.style.display = 'none';
  idReservaSelecionada = null;
  botaoAtual = null;
});

// Fecha o modal ao clicar fora dele
window.addEventListener('click', function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
    idReservaSelecionada = null;
    botaoAtual = null;
  }
});

// Confirmação da reserva
confirmar.addEventListener('click', () => {
  if (!idReservaSelecionada) return;

  // Simulação local (sem servidor)
  botaoAtual.classList.remove('confirmacao-pendente');
  botaoAtual.classList.add('confirmacao');

  modal.style.display = 'none';
  idReservaSelecionada = null;
  botaoAtual = null;
});