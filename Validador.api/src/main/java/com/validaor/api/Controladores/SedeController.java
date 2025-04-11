package com.validaor.api.Controladores;
import com.validaor.api.Modelo.Sede;
import com.validaor.api.Servicios.SedeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sede")
public class SedeController {

    @Autowired
    private SedeServicio sedeServicio;

    @GetMapping
    public ResponseEntity<List<Sede>> obtenerTodasSedes() {
        List<Sede> lista = sedeServicio.obtenerTodosSedes();
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }
}
