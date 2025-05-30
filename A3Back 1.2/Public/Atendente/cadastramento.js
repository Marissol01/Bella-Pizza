document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-reserva');
  
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formElement = e.target;

    const dados = {
      mesa: formElement.mesa.value,
      nome: formElement.nome.value,
      data: formElement.data.value,
      contato: formElement.contato.value,
      tempo: formElement.tempo.value,
      quantidade: formElement.quantidade.value
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
