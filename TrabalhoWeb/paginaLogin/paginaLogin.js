document.addEventListener('DOMContentLoaded', function () {
    window.onload = function () {
        // Verifica se o usuário está logado no localStorage
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
        // Se o usuário estiver logado
        if (usuarioLogado) {
            const usuarioNome = document.getElementById('userName');
            if (usuarioNome) {
                usuarioNome.innerText = `Olá, ${usuarioLogado.nome}`; // Exibe o nome do usuário
            }
    
            const usuarioNomeLi = document.getElementById('usuarioNome');
            if (usuarioNomeLi) {
                usuarioNomeLi.style.display = 'block'; // Exibe o item de usuário
            }
    
            const loginButton = document.getElementById('loginButton');
            if (loginButton) {
                loginButton.style.display = 'none'; // Esconde o botão de login
            }
    
            // Adiciona o evento de logout no botão "Sair"
            const sairButton = document.getElementById('sairButton');
            if (sairButton) {
                sairButton.addEventListener('click', function () {
                    // Remove o usuário do localStorage
                    localStorage.removeItem('usuarioLogado');
    
                    // Atualiza a interface (recarrega a página para refletir as mudanças)
                    window.location.reload();
                });
            }
    
        } else {
            // Se o usuário não estiver logado, exibe o botão de login
            const loginButton = document.getElementById('loginButton');
            if (loginButton) {
                loginButton.style.display = 'block';
            }
        }
    };
    
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
