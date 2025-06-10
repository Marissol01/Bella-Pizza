//SCRIPT VIEW PARA PESQUISAR RESERVAS CADASTRADAS POR UM FILTRO QUE CONSIDERA (MESA && DATA)
//Lógica = ok!, BackEnd = ok!

// Adiciona um ouvinte de evento de clique ao botão com a classe 'botao-pesquisa'
document.querySelector('.botao-pesquisa').addEventListener('click', async () => {

  // Seleciona todos os campos de entrada com a classe 'campo'
  const campos = document.querySelectorAll('.campo');
  const numeroMesa = campos[0].value.trim();         // Pega o valor do primeiro campo (número da mesa)
  const dataFormatada = campos[1].value.trim();       // Pega o valor do segundo campo (data em formato "AAAA-MM-DD")

  // Verifica se os dois campos foram preenchidos
  if (!numeroMesa || !dataFormatada) {
    alert('Preencha o número da mesa e a data!');
    return; // Interrompe a execução se algum campo estiver vazio
  }

  // Comentário desnecessário de conversão de data – já está no formato correto
  // const [dia, mes, ano] = dataDigitada.split('/');
  // const dataFormatada = `${ano}-${mes}-${dia}`;

  try {
    // Faz uma requisição GET à API local com os parâmetros da mesa e data
    const response = await fetch(`http://localhost:3000/reservas/filtro?id_mesa=${numeroMesa}&data=${dataFormatada}`);
    const reservas = await response.json(); // Converte a resposta em JSON

    // Seleciona o elemento <tbody> da tabela onde as reservas serão exibidas
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Limpa qualquer conteúdo anterior

    // Verifica se não há reservas
    if (reservas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Nenhuma reserva encontrada.</td></tr>';
      return;
    }

    // Para cada reserva recebida, cria uma nova linha na tabela
    reservas.forEach(reserva => {
      const linha = document.createElement('tr');

      // Preenche a linha com os dados da reserva
      linha.innerHTML = `
        <td>${reserva.id_mesa}</td>
        <td>${reserva.nome_cliente}</td>
        <td>${reserva.data_reserva}</td>
        <td>${reserva.contato}</td>
        <td>${reserva.duracao_reserva}</td>
        <td>${reserva.qtd_pessoas}</td>
        <td>${reserva.hora_reserva}</td>
      `;

      // Adiciona a linha ao corpo da tabela
      tbody.appendChild(linha);
    });
  } catch (error) {
    // Em caso de erro na requisição, exibe mensagem no console e alerta ao usuário
    console.error('Erro ao buscar reservas:', error);
    alert('Erro ao buscar reservas. Tente novamente.');
  }
});