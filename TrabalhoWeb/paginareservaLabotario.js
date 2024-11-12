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

function atualizarOpcoes(url, elementoSelect, mensagem) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter dados.");
            }
            return response.json();
        })
        .then(dados => {
            elementoSelect.innerHTML = `<option value="">${mensagem}</option>`;

            if (dados.length > 0) {
                dados.forEach(dado => {
                    const option = document.createElement("option");
                    option.value = dado;
                    option.textContent = dado;
                    elementoSelect.appendChild(option);
                });
                elementoSelect.disabled = false;
            } else {
                elementoSelect.disabled = true;
                alert(`Não há ${mensagem.toLowerCase()} disponíveis.`);
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Houve um problema ao obter os dados.");
        });
}

// Atualiza as opções de períodos e laboratórios quando a data é alterada
document.getElementById("data").addEventListener("change", function() {
    const data = this.value;
    const periodoSelect = document.getElementById("periodo");
    const laboratorioSelect = document.getElementById("laboratorio");

    if (data) {
        atualizarOpcoes(`http://localhost:8080/api/reservas/verificarData?data=${data}`, periodoSelect, "Selecione um período");
    }
   
    laboratorioSelect.innerHTML = '<option value="">Selecione um laboratório</option>';
    laboratorioSelect.disabled = true;
});

// Atualiza os laboratórios disponíveis quando a data e o período são selecionados
document.getElementById("periodo").addEventListener("change", function() {
    const data = document.getElementById("data").value;
    const periodo = this.value;
    const laboratorioSelect = document.getElementById("laboratorio");

    if (data && periodo) {
        atualizarOpcoes(`http://localhost:8080/api/reservas/verificarLaboratoriosPorPeriodo?data=${data}&periodo=${periodo}`, laboratorioSelect, "Selecione um laboratório");
    }
});

// Atualiza as aulas disponíveis quando a data, período e laboratório são selecionados
document.getElementById("laboratorio").addEventListener("change", function() {
    const data = document.getElementById("data").value;
    const periodo = document.getElementById("periodo").value;
    const laboratorio = this.value;
    const aulaSelect = document.getElementById("aula");

    if (data && periodo && laboratorio) {
        fetch(`http://localhost:8080/api/reservas/verificarAulas?data=${data}&periodo=${periodo}&laboratorio=${laboratorio}`)
            .then(response => response.json())
            .then(aulas => {
                
                aulaSelect.innerHTML = '<option value="">Selecione uma Aula</option>';

                aulas.forEach(aula => {
                    const option = document.createElement("option");
                    option.value = aula;
                    option.textContent = aula;
                    aulaSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Erro ao obter aulas:", error);
                alert("Houve um problema ao obter as aulas disponíveis.");
            });
    }
});

document.getElementById("reservation-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        alert("Usuário não encontrado. Faça login novamente.");
        return;
    }

    const usuario1 = JSON.parse(usuarioLogado);
    console.log("Usuário logado:", usuario1); // Verifique o conteúdo do usuário logado

    if (!usuario1 || !usuario1.idUsuario) {  // Aqui, usamos 'idUsuario' e não 'id'
        alert("ID do usuário não encontrado.");
        return;
    }

    const usuario = usuario1;  

    // Pega os dados do formulário
    const laboratorio = document.getElementById("laboratorio").value;
    const periodo = document.getElementById("periodo").value;
    const aula = document.getElementById("aula").value;
    const data = document.getElementById("data").value;

    // Cria o objeto de reserva, incluindo o ID do usuário com o nome correto (id_usuario)
    const reserva = { 
        data, 
        periodo, 
        laboratorio, 
        aula,
        usuario  
    };

    console.log("Dados a serem enviados:", reserva);

    fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro na reserva");
        }
        if (response.status === 204) {
            console.log("Resposta vazia (204 No Content)");
            return;
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            alert("Reserva criada com sucesso!");
            document.getElementById("reservation-form").reset();
            limparTabelas();
        }
    })
    .catch(error => {
        console.error("Erro:", error);
    });
});





function limparTabelas() {
    const tabelas = document.querySelectorAll(".tabela");
    tabelas.forEach(tabela => tabela.innerHTML = '');
}
