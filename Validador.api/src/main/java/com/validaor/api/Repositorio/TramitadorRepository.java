package com.validaor.api.Repositorio;

import com.validaor.api.Modelo.Tramitador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TramitadorRepository  extends  JpaRepository<Tramitador, String>{

    boolean existsByUsuario(String usuario);

    Optional<Tramitador> findByUsuario(String usuario);


}
