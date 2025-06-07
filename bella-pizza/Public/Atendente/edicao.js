// SÓ FUNCIONA COM BANCO DE DADOS FUNCIONANDO
const botaoConfirmar = document.querySelector('.confirmar');

botaoConfirmar.addEventListener('click', () => {
  // Pega os valores dos inputs do modal
  const inputs = document.querySelectorAll('.modal-campos input');
  const dados = {};
  
  inputs.forEach((input, index) => {
    // aqui você pode nomear as propriedades conforme os campos do formulário
    dados[`campo${index}`] = input.value;
  });

  const senha = document.querySelector('.modal-senha').value;

  // Aqui você faria a requisição para o servidor
  fetch('/rota-para-editar-reserva', {
    method: 'POST', // ou PUT, dependendo da API
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dados, senha })
  })
  .then(res => res.json())
  .then(resposta => {
    console.log('Resposta do servidor:', resposta);
    modal.style.display = 'none';  // fecha o modal após o envio
    // aqui você pode atualizar a interface, mostrar mensagem, etc.
  })
  .catch(erro => {
    console.error('Erro:', erro);
  });
});