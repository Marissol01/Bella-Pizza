//SCRIPT VIEW PARA A INTERFACE DE VISUALIZAR RESERVAS CADASTRADAS
//Lógica = ok! ; BackEnd = Ok!

async function carregarReservas() {
  try {
    const response = await fetch('http://localhost:3000/reservas/visualizar');
    const reservas = await response.json();

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa o conteúdo atual

    reservas.forEach(reserva => {
      const linha = document.createElement('tr');

      linha.innerHTML = `
          <td>${reserva.id_mesa}</td>
          <td>${reserva.nome_cliente}</td>
          <td>${reserva.data_reserva}</td>
          <td>${reserva.contato}</td>
          <td>${reserva.duracao_reserva}h</td>
          <td>${reserva.qtd_pessoas}</td>
          <td>${reserva.hora_reserva}h</td>
        `;

      tbody.appendChild(linha);
    });

  } catch (error) {
    console.error('Erro ao carregar reservas:', error);
  }

  //LEMBRAR DE ADICIONAR UMA LÓGICA PARA AS INTERFACES QUE VISUALIZAM STATUS CONFIRMADO TAMBÉM(Ex: Garcom,Gerente)🕑❌
}

// Executa ao abrir a página
window.addEventListener('DOMContentLoaded', carregarReservas);