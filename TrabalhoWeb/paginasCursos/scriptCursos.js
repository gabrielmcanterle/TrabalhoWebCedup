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
