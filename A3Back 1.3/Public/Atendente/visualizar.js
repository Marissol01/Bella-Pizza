async function carregarReservas() {
    try {
      const response = await fetch('http://localhost:3000/api/reservas');
      const reservas = await response.json();

      const tbody = document.querySelector('tbody');
      tbody.innerHTML = ''; // Limpa o conteúdo atual

      reservas.forEach(reserva => {
        const linha = document.createElement('tr');

        linha.innerHTML = `
          <td>${reserva.mesa}</td>
          <td>${reserva.nome}</td>
          <td>${reserva.data}</td>
          <td>${reserva.contato}</td>
          <td>${reserva.tempo}</td>
          <td>${reserva.quantidade}</td>
          <td>${reserva.horario}</td>
        `;

        tbody.appendChild(linha);
      });

    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  }

  // Executa ao abrir a página
  window.addEventListener('DOMContentLoaded', carregarReservas);