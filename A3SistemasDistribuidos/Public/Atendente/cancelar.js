//CANCELAMENTO DE RESERVA

let linhaSelecionada = null;

const botoesCancelar = document.querySelectorAll('.botao-cancelar');
const modal = document.getElementById('modal-editar');
const fechar = document.getElementById('fechar-modal');
const confirmar = document.querySelector('.confirmar');

// Ao clicar no botão de cancelar (ícone de lixeira)
botoesCancelar.forEach(botao => {
  botao.addEventListener('click', (e) => {
    linhaSelecionada = e.target.closest('tr'); // Pega a linha da tabela onde o botão foi clicado
    modal.style.display = 'flex';
  });
});

// Fecha o modal sem remover a linha
fechar.addEventListener('click', () => {
  modal.style.display = 'none';
  linhaSelecionada = null;
});

// Fecha o modal clicando fora dele
window.addEventListener('click', function (e) {
  if (e.target == modal) {
    modal.style.display = 'none';
    linhaSelecionada = null;
  }
});

// Confirma e remove a linha
confirmar.addEventListener('click', () => {
  if (linhaSelecionada) {
    linhaSelecionada.remove();
    linhaSelecionada = null;
    modal.style.display = 'none';
  }
});