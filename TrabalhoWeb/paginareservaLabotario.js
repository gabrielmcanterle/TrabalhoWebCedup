// Código para enviar a reserva
document.getElementById("reservation-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const laboratorio = document.getElementById("laboratorio").value;
    const periodo = document.getElementById("periodo").value;
    const aulas = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const data = document.getElementById("data").value;

    // Validação: Verifica se todos os campos estão preenchidos
    if (!laboratorio || !periodo || aulas.length === 0 || !data) {
        alert("Por favor, preencha todos os campos antes de enviar.");
        return; // Impede o envio do formulário
    }

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
});



document.getElementById("data").addEventListener("change", function() {
    const data = this.value;
    const laboratorioSelect = document.getElementById("laboratorio");

    // Chama o backend para obter os laboratórios disponíveis para a data selecionada
    fetch(`http://localhost:8080/api/reservas/laboratorios-disponiveis?data=${data}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao obter laboratórios disponíveis");
            }
            return response.json();
        })
        .then(laboratoriosDisponiveis => {
            // Limpa as opções atuais do laboratório
            laboratorioSelect.innerHTML = '<option value="">Selecione um laboratório</option>';

            // Adiciona as opções de laboratórios disponíveis
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


