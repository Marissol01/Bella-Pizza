//RESPONSÁVEL POR CONFIRMAR OCUPAÇÃO DA RESERVA
//LÓGICA = OK ; API BACKEND = OK!

// Ela carrega as reservas com status 'pendente' e ativa os eventos nos botões
async function carregarEAtivarEventos() {
  await carregarReservasPorStatus('pendente'); // Carrega reservas com status 'pendente'
  ativarConfirmacao(); // Ativa os eventos dos botões de confirmação após o conteúdo ter sido inserido no DOM
}

function ativarConfirmacao() {
  // Seleciona o corpo da tabela de reservas (já presente no HTML)
  const tabela = document.querySelector('.tabela-reservas tbody');

  // Seleciona os elementos do modal de confirmação
  const modal = document.getElementById('modal-editar');
  const fechar = document.getElementById('fechar-modal');
  const confirmar = document.getElementById('confirmar-modal');

  // Variáveis auxiliares para saber qual reserva foi selecionada
  let idReservaSelecionada = null;
  let botaoAtual = null;

  // ✅ PRINCIPAL MELHORIA: Delegação de eventos
  // Em vez de adicionar um listener para cada botão (que pode ainda não existir no DOM),
  // o evento de clique é delegado para o <tbody>, que já está presente no HTML.
  // Isso garante que novos botões adicionados dinamicamente também responderão ao clique.
  tabela.addEventListener('click', function (e) {
    // Verifica se o clique foi em um botão com a classe 'confirmacao-pendente'
    const botao = e.target.closest('.confirmacao-pendente');

    // Se não foi em um botão válido ou se o botão já está confirmado, sai da função
    if (!botao || botao.classList.contains('confirmacao')) return;

    // Armazena o ID da reserva e o botão clicado para uso posterior
    idReservaSelecionada = botao.dataset.reservaId;
    botaoAtual = botao;

    // Exibe o modal de confirmação
    modal.style.display = 'flex';
  });

  // Fecha o modal ao clicar no botão de fechar
  fechar.addEventListener('click', () => {
    modal.style.display = 'none';
    idReservaSelecionada = null;
    botaoAtual = null;
  });

  // Fecha o modal se o clique for fora do conteúdo (fundo do modal)
  window.addEventListener('click', function (e) {
    if (e.target == modal) {
      modal.style.display = 'none';
      idReservaSelecionada = null;
      botaoAtual = null;
    }
  });

  // Quando o botão "Confirmar" no modal for clicado:
  confirmar.addEventListener('click', async () => {
    if (!idReservaSelecionada) return;

    try {
      // Envia uma requisição PUT para a API para confirmar a reserva
      const response = await fetch(`http://localhost:3000/reservas/${idReservaSelecionada}/confirmar`, {
        method: 'PATCH', // ou POST, dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmada' // ou outro campo conforme sua API
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao confirmar reserva. Status: ${response.status}`);
      }

      botaoAtual.classList.remove('confirmacao-pendente');
      botaoAtual.classList.add('confirmacao');
      botaoAtual.textContent = 'Confirmado';

      // Fecha o modal e limpa os dados temporários
      modal.style.display = 'none';
      idReservaSelecionada = null;
      botaoAtual = null;

    } catch (error) {
      console.error('Erro ao confirmar reserva:', error);
      alert('Erro ao confirmar reserva. Tente novamente.');
    }
  });
}


// Quando o DOM estiver completamente carregado, chama a função principal
document.addEventListener('DOMContentLoaded', carregarEAtivarEventos);