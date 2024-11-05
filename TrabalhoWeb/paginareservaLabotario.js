// Função para verificar disponibilidade antes de enviar a reserva
async function verificarDisponibilidade(laboratorio, data, periodo) {
    const response = await fetch(`http://localhost:8080/verificarDisponibilidade?laboratorio=${laboratorio}&data=${data}&periodo=${periodo}`);
    if (!response.ok) {
        throw new Error("Erro ao verificar disponibilidade do laboratório.");
    }
    return await response.json();
}

// Código para enviar a reserva
document.getElementById("reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const laboratorio = document.getElementById("laboratorio").value;
    const periodo = document.getElementById("periodo").value;
    const aulas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const data = document.getElementById("data").value;

    // Validação: Verifica se todos os campos estão preenchidos
    if (!laboratorio || !periodo || aulas.length === 0 || !data) {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return;
    }

    try {
        // Verifica disponibilidade do laboratório antes de enviar a reserva
        const isDisponivel = await verificarDisponibilidade(laboratorio, data, periodo);
        if (!isDisponivel) {
            alert("O laboratório já está totalmente ocupado nesse dia e período.");
            return; // Impede o envio da reserva
        }

        // Se o laboratório estiver disponível, continue com a criação da reserva
        const reserva = {
            laboratorio,
            periodo,
            aulas,
            data
        };

        fetch("http://localhost:8080/api/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na reserva");
            }
            return response.json();
        })
        .then(data => {
            console.log("Reserva criada:", data);
            alert("Reserva realizada com sucesso!");
            document.getElementById("reservation-form").reset();
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Houve um problema ao realizar a reserva. Tente novamente.");
        });
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao verificar disponibilidade. Tente novamente.");
    }
});

// Atualiza os laboratórios disponíveis com base na data selecionada
document.getElementById("data").addEventListener("change", function() {
    const data = this.value;
    const laboratorioSelect = document.getElementById("laboratorio");

    fetch(`http://localhost:8080/api/reservas/laboratorios-disponiveis?data=${data}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter laboratórios disponíveis");
            }
            return response.json();
        })
        .then(laboratoriosDisponiveis => {
            laboratorioSelect.innerHTML = '<option value="">Selecione um laboratório</option>';

            laboratoriosDisponiveis.forEach(laboratorio => {
                const option = document.createElement("option");
                option.value = laboratorio;
                option.textContent = laboratorio;
                laboratorioSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Houve um problema ao obter os laboratórios disponíveis.");
        });
});

// Verifica a disponibilidade das aulas selecionadas para o laboratório escolhido
document.getElementById("laboratorio").addEventListener("change", function() {
    const laboratorio = this.value;
    
    const aulasSelecionadas = Array.from(document.querySelectorAll(".form-check-input:checked"))
                                    .map(checkbox => checkbox.value);

    if (aulasSelecionadas.length === 0) {
        alert("Nenhuma aula selecionada.");
        return;
    }

    const aulasQueryParam = encodeURIComponent(JSON.stringify(aulasSelecionadas));

    fetch(`http://localhost:8080/api/reservas/aulas-indisponiveis?aulas=${aulasQueryParam}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter aulas não disponíveis");
            }
            return response.json();
        })
        .then(aulasIndisponiveis => {
            console.log("Aulas indisponíveis:", aulasIndisponiveis);

            const checkboxes = document.querySelectorAll(".form-check-input");

            checkboxes.forEach(checkbox => {
                if (aulasIndisponiveis.includes(checkbox.value)) {
                    checkbox.disabled = true;
                } else {
                    checkbox.disabled = false;
                }
            });

            const todasAsAulasIndisponiveis = aulasIndisponiveis.length === 5;

            const laboratorioSelect = document.getElementById("laboratorio");
            if (todasAsAulasIndisponiveis) {
                laboratorioSelect.disabled = true;
                alert("Todas as aulas estão ocupadas para este laboratório.");
            } else {
                laboratorioSelect.disabled = false;
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Houve um problema ao obter as aulas não disponíveis.");
        });
});
