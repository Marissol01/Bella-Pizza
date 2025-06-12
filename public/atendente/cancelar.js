//CANCELAMENTO DE RESERVA = LEMBRAR DE CORRIGIR!!


// Quando o DOM estiver pronto, faça isso:
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Carregar reservas pendentes para essa página
  await carregarReservasPorStatus('pendente');

  // 2. Depois que as linhas estiverem carregadas, ativar eventos de cancelamento
  ativarCancelamento();
});

function ativarCancelamento() {
  const tabela = document.querySelector('.tabela-reservas tbody');
  const modal = document.getElementById('modal-editar');
  const fechar = document.getElementById('fechar-modal');
  const confirmar = document.querySelector('.confirmar');

  let linhaSelecionada = null;

  // Clique no botão cancelar
  tabela.addEventListener('click', (e) => {
    const botao = e.target.closest('.botao-cancelar');
    if (!botao) return;

    linhaSelecionada = botao.closest('tr');
    modal.style.display = 'flex';
  });

  // Fecha o modal ao clicar no "X"
  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
    linhaSelecionada = null;
  });

  // Fecha o modal ao clicar fora dele
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      linhaSelecionada = null;
    }
  });

  // Confirma o cancelamento
  confirmar.addEventListener('click', () => {
  if (!linhaSelecionada) return;

  const idReserva = linhaSelecionada.dataset.idReserva;
  const mesaReserva = linhaSelecionada.dataset.mesaReserva;

  fetch(`http://localhost:3000/reservas/${idReserva}/cancelar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        id_reserva: idReserva,
        id_mesa: mesaReserva   
    })
  })
    .then(res => res.json())
    .then(dados => {
      if (dados.sucesso) {
        linhaSelecionada.remove(); // agora sim, remover após sucesso
        console.log('Reserva cancelada com sucesso!');
      } else {
        console.error('Erro ao cancelar a reserva:', dados.erro);
      }
    })
    .catch(err => {
      console.error('Erro de requisição:', err);
    })
    .finally(() => {
      modal.style.display = 'none';
      linhaSelecionada = null;
    });
});
}



/*// Caso esteja carregando reservas dinamicamente, pode usar isso:
async function carregarEAtivarEventosCancelamento() {
  await carregarReservasPorStatus('pendente'); // Se for usar com dados dinâmicos
  ativarCancelamento();
}
// Caso os dados já estejam no HTML (estático), só ativa os eventos
document.addEventListener('DOMContentLoaded', () => {
  ativarCancelamento(); // ou carregarEAtivarEventosCancelamento()
});*/