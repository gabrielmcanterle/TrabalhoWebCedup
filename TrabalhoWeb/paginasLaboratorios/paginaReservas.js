document.addEventListener("DOMContentLoaded", function() {
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
    

    // Fazer a requisição para buscar as reservas do usuário
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;

    fetch(`http://localhost:8080/api/reservas/usuario/${usuarioLogado.idUsuario}`)
        .then(response => response.json())
        .then(reservas => {
            const reservasList = document.getElementById("reservas-list");

            // Se o usuário não tiver reservas
            if (reservas.length === 0) {
                reservasList.innerHTML = "<tr><td colspan='5'>Você ainda não tem reservas.</td></tr>";
                return;
            }

            // Preencher a tabela com as reservas
            reservas.forEach(reserva => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reserva.data}</td>
                    <td>${reserva.periodo}</td>
                    <td>${reserva.laboratorio}</td>
                    <td>${reserva.aula}</td>
                    <td>
                        <button class="remove-btn" onclick="removerReserva(${reserva.id})">Remover</button>
                    </td>
                `;
                reservasList.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar as reservas:", error);
            alert("Houve um erro ao carregar suas reservas.");
        });
});

// Função para remover reserva
function removerReserva(reservaId) {
    if (confirm("Tem certeza de que deseja remover esta reserva?")) {
        // Fazer a requisição para remover a reserva (será configurado no backend posteriormente)
        fetch(`http://localhost:8080/api/reservas/${reservaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert("Reserva removida com sucesso.");
                window.location.reload(); // Recarrega a página para atualizar as reservas
            } else {
                alert("Erro ao remover a reserva.");
            }
        })
        .catch(error => {
            console.error("Erro ao remover reserva:", error);
            alert("Houve um erro ao remover a reserva.");
        });
    }
}
