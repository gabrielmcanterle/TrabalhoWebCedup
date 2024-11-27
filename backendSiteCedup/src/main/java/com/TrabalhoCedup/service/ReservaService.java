package com.TrabalhoCedup.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.TrabalhoCedup.entity.Reserva;
import com.TrabalhoCedup.entity.Usuario;
import com.TrabalhoCedup.repository.ReservaRepository;

@Service
public class ReservaService {

	@Autowired
	private ReservaRepository reservaRepository;
	
	public void removerReserva(Long id) {
	    reservaRepository.deleteById(id);
	}
	
	 public List<Reserva> buscarReservasPorUsuario(Usuario usuario) {
	        return reservaRepository.findReservasByUsuario(usuario);
	    }

	public void salvarReserva(String data, String periodo, String laboratorio, String aula, Usuario usuario) {

		Reserva reserva = new Reserva();
		reserva.setData(data);
		reserva.setPeriodo(periodo);
		reserva.setLaboratorio(laboratorio);
		reserva.setAula(aula);
		reserva.setUsuario(usuario);
		reservaRepository.save(reserva);
	}

	public List<Reserva> escolhaDeData(String data) {
		List<Reserva> reservas = reservaRepository.escolhaDeData(data);
		return reservas;
	}

	public List<Reserva> escolhaDePeriodoeData(String data, String periodo) {
		List<Reserva> reservas = reservaRepository.escolhaDePeriodoeData(data, periodo);
		return reservas;
	}

	public List<Reserva> escolhaDeLaboratorioeDataePeriodo(String data, String periodo, String laboratorio) {
		List<Reserva> reservas = reservaRepository.escolhaDeLaboratorioeDataePeriodo(data, periodo, laboratorio);
		return reservas;
	}

	public List<Reserva> escolhaDeAula(String aula) {
		List<Reserva> reservas = reservaRepository.escolhaDeAula(aula);
		return reservas;
	}
}
