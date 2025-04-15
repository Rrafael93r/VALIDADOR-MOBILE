package com.validaor.api.Servicios;

import com.validaor.api.Modelo.Tramitador;
import com.validaor.api.Repositorio.TramitadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TramitadorServicio {

    @Autowired
    private TramitadorRepository tramitadorRepository;

    public Tramitador crearTramitador(Tramitador tramitador) {
        if (tramitadorRepository.existsByUsuario(tramitador.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }
        return tramitadorRepository.save(tramitador);
    }

    public List<Tramitador> obtenerTodosTramitadores() {
        return tramitadorRepository.findAll();
    }

    public Tramitador obtenerTramitadorPorId(String identificacion) {
        return tramitadorRepository.findById(identificacion).orElse(null);
    }

    public Tramitador actualizarTramitador(String identificacion, Tramitador tramitador) {
        Optional<Tramitador> tramitadorExistente = tramitadorRepository.findById(identificacion);

        if (tramitadorExistente.isPresent()) {
            Tramitador tramitadorActualizado = tramitadorExistente.get();

            // Verificar si el nuevo usuario ya existe y no es el mismo tramitador
            if (!tramitadorActualizado.getUsuario().equals(tramitador.getUsuario()) &&
                    tramitadorRepository.existsByUsuario(tramitador.getUsuario())) {
                throw new RuntimeException("El nuevo usuario ya existe");
            }


            tramitadorActualizado.setTipoIdentificacion(tramitador.getTipoIdentificacion());
            tramitadorActualizado.setNombre(tramitador.getNombre());
            tramitadorActualizado.setTelefono(tramitador.getTelefono());
            tramitadorActualizado.setDireccion(tramitador.getDireccion());
            tramitadorActualizado.setSoporteAdjunto1(tramitador.getSoporteAdjunto1());
            tramitadorActualizado.setSoporteAdjunto2(tramitador.getSoporteAdjunto2());
            tramitadorActualizado.setEstado(tramitador.getEstado());
            tramitadorActualizado.setUsuario(tramitador.getUsuario());
            tramitadorActualizado.setContrasena(tramitador.getContrasena());
            tramitadorActualizado.setPerfil(tramitador.getPerfil());

            return tramitadorRepository.save(tramitadorActualizado);
        }
        return null;
    }

    public Tramitador validarCredenciales(String identificacion, String contrasena) {
        Optional<Tramitador> tramitador = tramitadorRepository.findById(identificacion);
        if (tramitador.isPresent() && tramitador.get().getContrasena().equals(contrasena)) {
            return tramitador.get();
        }
        return null;
    }


    public void eliminarTramitador(String identificacion) {
        tramitadorRepository.deleteById(identificacion);
    }
}
