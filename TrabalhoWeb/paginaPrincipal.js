window.onload = function () {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));


    if (usuarioLogado) {
        const usuarioNome = document.getElementById('userName');
        if (usuarioNome) {
            usuarioNome.innerText = `Olá, ${usuarioLogado.nome}`;
        }
        const usuarioNomeLi = document.getElementById('usuarioNome');
        if (usuarioNomeLi) {
            usuarioNomeLi.style.display = 'block';
        }
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    } else {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.style.display = 'block';
        }
    }
};
