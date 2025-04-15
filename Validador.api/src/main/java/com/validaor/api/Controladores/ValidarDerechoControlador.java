package com.validaor.api.Controladores;

import com.validaor.api.Servicios.ValidarDerechoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/validar")
public class ValidarDerechoControlador {


    @Autowired
    private ValidarDerechoServicio validarDerechoServicio;

    @PostMapping("/documento")
    public ResponseEntity<Map<String, String>> validarDocumento(@RequestBody Map<String, String> datos) {
        String tipoDocumento = datos.get("tipoDocumento");
        String numeroDocumento = datos.get("numeroDocumento");

        try {
            String resultado = validarDerechoServicio.validarDocumento(tipoDocumento, numeroDocumento);

            // Parsear el resultado (formato: "estado|regimen|nombre")
            String[] partes = resultado.split("\\|");
            Map<String, String> respuesta = new HashMap<>();

            if (partes.length >= 3) {
                respuesta.put("estado", partes[0]);
                respuesta.put("regimen", partes[1]);
                respuesta.put("nombre", partes[2]);
                respuesta.put("valido", "true");
                return ResponseEntity.ok(respuesta);
            } else {
                respuesta.put("valido", "false");
                respuesta.put("mensaje", "No se encontró información del afiliado");
                return ResponseEntity.ok(respuesta);
            }
        } catch (Exception e) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("valido", "false");
            respuesta.put("mensaje", "Error al validar: " + e.getMessage());
            return ResponseEntity.ok(respuesta);
        }
    }



}
