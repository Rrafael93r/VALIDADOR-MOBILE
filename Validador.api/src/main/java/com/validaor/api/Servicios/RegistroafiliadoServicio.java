package com.validaor.api.Servicios;

import com.validaor.api.Modelo.Registroafiliado;
import com.validaor.api.Repositorio.RegistroafiliadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroafiliadoServicio {

    @Autowired
    private RegistroafiliadoRepository registroafiliadoRepository;

    public Registroafiliado createregistro(Registroafiliado registroafiliado){
        return registroafiliadoRepository.save(registroafiliado);
    }

    public List<Registroafiliado> getAllRegistroafiliado(){
        return registroafiliadoRepository.findAll();
    }

    public Registroafiliado getregistroById(String id) {
        return registroafiliadoRepository.findById(id).orElse(null);
    }

    public Registroafiliado updateregistro(String id, Registroafiliado registroafiliado) {
        Optional<Registroafiliado> existingregistro = registroafiliadoRepository.findById(id);

        if (existingregistro.isPresent()) {
            Registroafiliado updatedRegistro = existingregistro.get();

            updatedRegistro.setCodigoGenerado(registroafiliado.getCodigoGenerado());
            updatedRegistro.setFechaRegistro(registroafiliado.getFechaRegistro());
            updatedRegistro.setHoraRegistro(registroafiliado.getHoraRegistro());
            updatedRegistro.setTipoDocumentoAfiliado(registroafiliado.getTipoDocumentoAfiliado());
            updatedRegistro.setNumeroDocumentoAfiliado(registroafiliado.getNumeroDocumentoAfiliado());
            updatedRegistro.setNombreAfiliado(registroafiliado.getNombreAfiliado());
            updatedRegistro.setSoporteAdjunto1(registroafiliado.getSoporteAdjunto1());
            updatedRegistro.setSoporteAdjunto2(registroafiliado.getSoporteAdjunto2());
            updatedRegistro.setTipoDocumentoTramitador(registroafiliado.getTipoDocumentoTramitador());
            updatedRegistro.setNumeroDocumentoTramitador(registroafiliado.getNumeroDocumentoTramitador());
            updatedRegistro.setFechaAceptacion(registroafiliado.getFechaAceptacion());
            updatedRegistro.setHoraAceptacion(registroafiliado.getHoraAceptacion());
            updatedRegistro.setEstado(registroafiliado.getEstado());
            updatedRegistro.setSoporteformula(registroafiliado.getSoporteformula());

            return registroafiliadoRepository.save(updatedRegistro);
        } else {
            return null;
        }
    }

    public void deleteregistro(String id) {
        registroafiliadoRepository.deleteById(id);
    }
}


