document.getElementById('loginform').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value;

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, senha }),
  });

  if (response.ok) {
    const usuario = await response.json();
    if (usuario.tipo_funcionario === "Atendente") {
      window.location.href = 'atendente/atendente.html';
    } else if (usuario.tipo_funcionario === "Garçom") {
      window.location.href = 'garçom/garcom.html';
    } else if (usuario.tipo_funcionario === "Gerente") {
      window.location.href = 'gerente/gerente.html';
    }
  } else {
  const usuarioInput = document.getElementById('usuario');
  const senhaInput = document.getElementById('senha');
  const mensagemErro = document.getElementById('mensagem-erro');

  usuarioInput.classList.add('input-erro');
  senhaInput.classList.add('input-erro');
  mensagemErro.style.display = 'block';

  setTimeout(() => {
    usuarioInput.classList.remove('input-erro');
    senhaInput.classList.remove('input-erro');
    mensagemErro.style.display = 'none';
  }, 3000);
}
});