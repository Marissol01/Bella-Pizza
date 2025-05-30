document.getElementById('loginform').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('usuario').value;
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
    alert("❌ Usuário ou senha incorretos.");
  }
});