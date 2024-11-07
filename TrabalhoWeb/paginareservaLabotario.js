let reservedLessons = {}; // Para armazenar as aulas reservadas
        let currentWeek = 0; // Semana atual sendo exibida
        let totalWeeks = 0; // Total de semanas no mês
        let totalDays = 0; // Total de dias úteis no mês

        // Função para formatar a data para 'YYYY-MM-DD'
        function formatDate(year, month, day) {
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }

        // Função para atualizar o calendário
        async function updateCalendar(reservas = []) {
            const currentMonth = document.getElementById('monthSelect').value;
            const period = document.getElementById('periodSelect').value;
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
            
            const firstDayOfMonth = new Date(2024, currentMonth, 1);
            const lastDayOfMonth = new Date(2024, currentMonth + 1, 0);
            totalDays = lastDayOfMonth.getDate();
            const firstDayWeekday = firstDayOfMonth.getDay();

            totalWeeks = Math.ceil((totalDays + firstDayWeekday) / 5); // 5 dias úteis por semana

            let calendarHTML = `<h2 style="text-align:center">${monthNames[currentMonth]} - ${period === 'manha' ? 'Manhã' : period === 'tarde' ? 'Tarde' : 'Noite'}</h2>`;
            calendarHTML += `<table><thead><tr>`;
            daysOfWeek.forEach(day => {
                calendarHTML += `<th>${day}</th>`;
            });
            calendarHTML += `</tr></thead><tbody>`;

            let dayCounter = 1;
            for (let i = 0; i < totalWeeks; i++) { // Para cada semana
                calendarHTML += `<tr>`;
                for (let j = 0; j < 5; j++) { // Para cada dia útil (segunda a sexta)
                    if (dayCounter <= totalDays) {
                        calendarHTML += `<td>`;
                        calendarHTML += `<div><strong>Dia ${dayCounter}</strong></div>`;

                        // Verificar se há reservas para esse dia e período
                        reservas.forEach(reserva => {
                            const reservaDate = new Date(reserva.data);
                            const dayMatch = reservaDate.getDate() === dayCounter;
                            const periodMatch = reserva.periodo === period;
                            if (dayMatch && periodMatch) {
                                const lessonId = `${dayCounter}-${reserva.aula}`;
                                reservedLessons[lessonId] = true;
                            }
                        });

                        // Adicionando as aulas para o dia
                        for (let k = 0; k < 5; k++) {
                            const lessonId = `${dayCounter}-${k}`;
                            const isReserved = reservedLessons[lessonId] || false;
                            const lessonClass = isReserved ? "lesson reserved" : "lesson";

                            calendarHTML += `<div class="${lessonClass}" id="lesson-${lessonId}">
                                                <div class="lesson-time">Aula ${k + 1}</div>
                                                <div class="lesson-name">Descrição da Aula ${k + 1}</div>
                                                <button class="reserve-btn" onclick="reserveLesson('${lessonId}', ${dayCounter}, ${k})" ${isReserved ? 'disabled' : ''}>Reservar</button>
                                            </div>`;
                        }
                        calendarHTML += `</td>`;
                    } else {
                        calendarHTML += `<td></td>`;
                    }
                    dayCounter++;
                }
                calendarHTML += `</tr>`;
            }

            calendarHTML += `</tbody></table>`;

            // Inserindo o conteúdo do calendário na página
            document.getElementById('calendarContainer').innerHTML = calendarHTML;
        }

        // Função para reservar uma aula
        function reserveLesson(lessonId, day, lessonNumber) {
            reservedLessons[lessonId] = true;
            const lessonElement = document.getElementById(`lesson-${lessonId}`);
            lessonElement.classList.add("reserved");
            lessonElement.querySelector(".reserve-btn").disabled = true;
            lessonElement.querySelector(".reserve-btn").innerText = "Reservada";
            alert(`Aula ${lessonNumber + 1} no dia ${day} reservada com sucesso!`);
        }

        // Função para obter as reservas de aulas do backend
        async function getReservations() {
            const laboratorio = "lab1";  // Exemplo de laboratório
            const periodo = document.getElementById('periodSelect').value;
            const aula = "A1";  // Exemplo de aula
            const descricao = "";  // Descrição opcional
            const currentMonth = document.getElementById('monthSelect').value;
            const day = "01";  // Usando o primeiro dia como exemplo
            const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
            const data = `2024-${formattedMonth}-${day}`;

            const url = `http://127.0.0.1:8080/api/reservas/verificarAulasReservadas?laboratorio=${laboratorio}&data=${data}&periodo=${periodo}&aula=${aula}&descricao=${descricao}`;

            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Erro ao obter as reservas.');
                const reservas = await response.json();

                if (reservas && reservas.length > 0) {
                    console.log("Dados recebidos:", reservas);
                    updateCalendar(reservas);
                } else {
                    console.log("Nenhuma reserva encontrada.");
                    alert("Não há aulas reservadas para esta data/período.");
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert("Ocorreu um erro ao carregar as reservas.");
            }
        }

        // Inicializa o calendário ao carregar a página
        window.onload = function() {
            getReservations();  // Carrega as reservas ao carregar a página
        };