const botoes = {
  cadastro: 'cadastramento.html',
  editar: 'edicao.html',
  visualizar: 'visualizar.html',
  cancelar: 'cancelar.html',
  exit: '../login.html',
};

for (let id in botoes) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = botoes[id];
    });
  }
}

// Código limpo e escalável