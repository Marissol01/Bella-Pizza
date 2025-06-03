//Lógica = ok!, BackEnd = ok!

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-reserva');

  //REVISAR, ADICIONAR HORÁRIO DE RESERVA?  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formElement = e.target;

    const dados = {
      mesa: formElement.mesa.value,
      nome: formElement.nome.value,
      data: formElement.data.value,
      contato: formElement.contato.value,
      tempo: formElement.tempo.value, // ex: "120"
      quantidade: formElement.quantidade.value,
      horario: formElement.horario.value // novo input ex: "19:00"
    };

    try {
      const response = await fetch('http://localhost:3000/reservas/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const text = await response.text();
      console.log("Resposta bruta:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Resposta do servidor não era JSON.");
      }

      if (response.ok) {
        alert(result.message);
        formElement.reset();
        console.log('Reserva cadastrada, ID:', result.id_reserva);
        console.log('Mesa recebida:', dados.mesa);
      } else {
        alert(result.error);
      }

    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Erro inesperado. Verifique o console.');
    }
  });
});
//AO RECARREGAR A PÁGINA, O SELECT ATUALIZA E MOSTRA NOVOS id_mesa DO BANCO DE DADOS✅
document.addEventListener('DOMContentLoaded', () => {
  const selectMesa = document.getElementById('mesa-select');

  fetch('/mesas/ids')
    .then(response => response.json())
    .then(mesas => {
      mesas.forEach(mesa => {
        const option = document.createElement('option');
        option.value = mesa.id; // ou mesa.id_mesa
        option.textContent = `Mesa ${mesa.id} (capacidade: ${mesa.capacidade})`;
        selectMesa.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar mesas disponíveis:', error);
    });
});
