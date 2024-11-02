document.getElementById('botao').addEventListener('click', function() {
    const valorInput = document.getElementById('input').value;
    fetch('http://localhost:8081/api/receber-dado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conteudo: valorInput }) // Envia o valor do input
    })
    .then(response => {
        console.log('Status da resposta:', response.status); // Adiciona esta linha
        return response.text();
    })
    .then(data => {
        console.log('Resposta do backend:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});