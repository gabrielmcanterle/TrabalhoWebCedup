package com.TrabalhoCedup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.TrabalhoCedup.entity.Reserva;
import com.TrabalhoCedup.entity.Usuario;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
	
	@Query("SELECT r FROM Reserva r WHERE r.usuario = :usuario")
	List<Reserva> findReservasByUsuario(@Param("usuario") Usuario usuario);

	
	@Query("INSERT INTO Reserva (data, periodo, laboratorio, aula , usuario) VALUES (:data, :periodo, :laboratorio, :aula, :usuario)")
	void salvarReserva(@Param("data") String data, @Param("periodo") String periodo,
			@Param("laboratorio") String laboratorio, @Param("aula") String aula, @Param("usuario") Usuario usuario);

	@Query("SELECT r FROM Reserva r WHERE r.data = :data")
	List<Reserva> escolhaDeData(String data);

	@Query("SELECT r FROM Reserva r WHERE r.periodo = :periodo AND r.data = :data")
	List<Reserva> escolhaDePeriodoeData(String data, String periodo);

	@Query("SELECT r FROM Reserva r WHERE r.laboratorio = :laboratorio AND r.data = :data AND r.periodo = :periodo")
	List<Reserva> escolhaDeLaboratorioeDataePeriodo(String data, String periodo, String laboratorio);

	@Query("SELECT r FROM Reserva r WHERE r.aula = :aula")
	List<Reserva> escolhaDeAula(String aula);

}
