package com.validaor.api.Servicios;
import com.validaor.api.Modelo.Sede;
import com.validaor.api.Repositorio.SedeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SedeServicio {

    @Autowired
    private SedeRepository sedeRepository;

    public List<Sede> obtenerTodosSedes() {
        return sedeRepository.findAll();
    }
}
