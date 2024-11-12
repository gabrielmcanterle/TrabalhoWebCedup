document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
        const usuarioNome = document.getElementById('usuarioNome');
        const userNameLink = document.getElementById('userName');
        if (usuarioNome && userNameLink) {
            usuarioNome.style.display = 'block';
            userNameLink.innerText = `Olá, ${usuario.nome}`;
        }
    }
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://127.0.0.1:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }
            return response.json();
        })
        .then(usuario => {
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            const loginButton = document.getElementById('loginButton');
            if (loginButton) {
                loginButton.style.display = 'none';
            }

            const usuarioNome = document.getElementById('usuarioNome');
            const userNameLink = document.getElementById('userName');
            if (usuarioNome && userNameLink) {
                usuarioNome.style.display = 'block';
                userNameLink.innerText = `Olá, ${usuario.nome}`;
            }
            setTimeout(function () {
                window.location.href = '/TrabalhoWeb/paginaPrincipal.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Erro no login:', error);
            alert('Erro no login: ' + error.message);
        });
});
