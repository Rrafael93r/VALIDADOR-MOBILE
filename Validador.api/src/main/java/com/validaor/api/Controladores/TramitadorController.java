package com.validaor.api.Controladores;

import com.validaor.api.Modelo.Tramitador;
import com.validaor.api.Servicios.TramitadorServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tramitador")
public class TramitadorController {


    @Autowired
    private TramitadorServicio tramitadorServicio;

    @PostMapping
    public ResponseEntity<?> crearTramitador(@RequestBody Tramitador tramitador) {
        try {
            Tramitador nuevoTramitador = tramitadorServicio.crearTramitador(tramitador);
            return new ResponseEntity<>(nuevoTramitador, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Tramitador tramitador) {
        // Primero intentamos buscar por identificación directamente
        Tramitador usuarioEncontrado = tramitadorServicio.validarCredenciales(tramitador.getIdentificacion(), tramitador.getContrasena());

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        // Si se encuentra, devolvemos el usuario
        return ResponseEntity.ok(usuarioEncontrado);
    }


    @GetMapping
    public ResponseEntity<List<Tramitador>> obtenerTodosTramitadores() {
        List<Tramitador> tramitadores = tramitadorServicio.obtenerTodosTramitadores();
        return new ResponseEntity<>(tramitadores, HttpStatus.OK);
    }

    @GetMapping("/{identificacion}")
    public ResponseEntity<Tramitador> obtenerTramitadorPorId(@PathVariable String identificacion) {
        Tramitador tramitador = tramitadorServicio.obtenerTramitadorPorId(identificacion);
        if (tramitador != null) {
            return new ResponseEntity<>(tramitador, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{identificacion}")
    public ResponseEntity<?> actualizarTramitador(@PathVariable String identificacion, @RequestBody Tramitador tramitador) {
        try {
            Tramitador tramitadorActualizado = tramitadorServicio.actualizarTramitador(identificacion, tramitador);
            if (tramitadorActualizado != null) {
                return new ResponseEntity<>(tramitadorActualizado, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{identificacion}")
    public ResponseEntity<Void> eliminarTramitador(@PathVariable String identificacion) {
        tramitadorServicio.eliminarTramitador(identificacion);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
