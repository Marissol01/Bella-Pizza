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

  fetch(`/reservas/${reservaId}/confirmar`, {
    method: 'PATCH' //Atualizações Parciais
  })
  .then(response => {
    if (response.ok) {
      // Sucesso → muda a cor do botão para verde
      botaoAtual.classList.remove('confirmacao-pendente');
      botaoAtual.classList.add('confirmacao-confirmada'); // defina essa classe no CSS como verde
      botaoAtual.textContent = 'Confirmada ✅';
    } else {
      alert('Erro ao confirmar reserva.');
    }
    modal.style.display = 'none';
    idReservaSelecionada = null;
    botaoAtual = null;
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Erro de comunicação com o servidor.');
    modal.style.display = 'none';
  });
});