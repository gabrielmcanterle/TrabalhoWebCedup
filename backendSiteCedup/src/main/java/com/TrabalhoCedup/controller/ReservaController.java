package com.TrabalhoCedup.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.TrabalhoCedup.entity.Reserva;
import com.TrabalhoCedup.entity.Usuario;
import com.TrabalhoCedup.service.ReservaService;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://127.0.0.1:8081") // permissão para fazer o fetch da porta 8081.
public class ReservaController {

	@Autowired
	private ReservaService reservaService;
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> removerReserva(@PathVariable Long id) {
	    try {
	        reservaService.removerReserva(id);
	        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("{\"message\": \"Reserva removida com sucesso.\"}");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Erro ao remover a reserva.\"}");
	    }
	}

	
	 @GetMapping("/usuario/{idUsuario}")
	    public ResponseEntity<List<Reserva>> obterReservasPorUsuario(@PathVariable Long idUsuario) {
	    	 Usuario usuario = new Usuario();
	        usuario.setidUsuario(idUsuario);  

	        // Chamar o serviço para buscar as reservas
	        List<Reserva> reservas = reservaService.buscarReservasPorUsuario(usuario);

	        if (reservas.isEmpty()) {
	            return ResponseEntity.noContent().build(); // Retorna 204 caso não haja reservas
	        }
	        return ResponseEntity.ok(reservas); // Retorna as reservas com status 200
	    }
	

	@PostMapping
	public ResponseEntity<String> criarReserva(@RequestBody Reserva reserva) {
		try {
			
			
			reservaService.salvarReserva(reserva.getData(), reserva.getPeriodo(), reserva.getLaboratorio(),
					reserva.getAula(), reserva.getUsuario());

			// Mensagem JSON de reserva criada
			return ResponseEntity.status(HttpStatus.CREATED).body("{\"message\": \"Reserva criada com sucesso\"}");
		} catch (Exception e) {
			// Mensagem de erro 500 JSON
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("{\"message\": \"Erro ao criar reserva\"}");
		}
	}

	@GetMapping("/verificarData")
	public List<String> verificarData(@RequestParam String data) {

	    // Obter todas as reservas para a data informada
	    List<Reserva> reservas = reservaService.escolhaDeData(data);

	    // Contar as reservas por laboratório
	    Map<String, Long> contagemLaboratorios = reservas.stream()
	            .collect(Collectors.groupingBy(Reserva::getLaboratorio, Collectors.counting()));

	    // Contar as reservas por período
	    Map<String, Long> contagemPeriodos = reservas.stream()
	            .collect(Collectors.groupingBy(Reserva::getPeriodo, Collectors.counting()));

	    // Lista de laboratórios disponíveis (5 no total)
	    List<String> laboratoriosDisponiveis = new ArrayList<>(Arrays.asList("lab1", "lab2", "lab3", "lab4", "lab5"));

	    // Remover laboratórios que já possuem 5 aulas reservadas
	    laboratoriosDisponiveis.removeIf(laboratorio -> contagemLaboratorios.getOrDefault(laboratorio, 0L) >= 5);

	    // Lista de períodos disponíveis
	    List<String> periodosDisponiveis = new ArrayList<>(Arrays.asList("manha", "tarde", "noite"));

	    // Remover períodos que já atingiram o limite de 5 reservas (período cheio)
	    periodosDisponiveis.removeIf(periodo -> contagemPeriodos.getOrDefault(periodo, 0L) >= 25);

	    return periodosDisponiveis;
	}


	@GetMapping("/verificarLaboratoriosPorPeriodo")
	public List<String> verificarLaboratoriosPorPeriodo(@RequestParam String data, @RequestParam String periodo) {

		List<Reserva> reservas = reservaService.escolhaDePeriodoeData(data, periodo);

		List<String> laboratoriosDisponiveis = new ArrayList<>(Arrays.asList("lab1", "lab2", "lab3", "lab4", "lab5"));

		// Para cada laboratório, verificamos se todas as 5 aulas estão ocupadas
		laboratoriosDisponiveis.removeIf(laboratorio -> {
			// Filtra as reservas para o laboratório atual na data e no período
			List<Reserva> reservasLaboratorio = reservas.stream()
					.filter(reserva -> reserva.getLaboratorio().equals(laboratorio)).collect(Collectors.toList());

			long aulasReservadas = reservasLaboratorio.size();

			return aulasReservadas == 5;
		});

		if (laboratoriosDisponiveis.isEmpty()) {
			return Arrays.asList();
		}
		return laboratoriosDisponiveis;
	}

	@GetMapping("/verificarAulas")
	public List<String> verificarAulas(@RequestParam String data, @RequestParam String periodo,
			@RequestParam String laboratorio) {

		List<Reserva> aulasReservadas = reservaService.escolhaDeLaboratorioeDataePeriodo(data, periodo, laboratorio);

		Set<String> aulasReservadasSet = aulasReservadas.stream().map(Reserva::getAula).collect(Collectors.toSet());

		List<String> aulasDisponiveis = new ArrayList<>(Arrays.asList("aula1", "aula2", "aula3", "aula4", "aula5"));

		aulasDisponiveis.removeAll(aulasReservadasSet);

		return aulasDisponiveis;
	}

}
