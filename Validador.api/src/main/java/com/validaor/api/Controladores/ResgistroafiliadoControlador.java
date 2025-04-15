package com.validaor.api.Controladores;


import com.validaor.api.Modelo.Registroafiliado;
import com.validaor.api.Servicios.ArchivoServicio;
import com.validaor.api.Servicios.RegistroafiliadoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registroafiliado")
public class ResgistroafiliadoControlador {

    @Autowired
    private RegistroafiliadoServicio registroafiliadoServicio;

    @Autowired
    private ArchivoServicio archivoServicio;

    @PostMapping
    public ResponseEntity<Registroafiliado> crearRegistro(
            @RequestParam(value = "codigoGenerado", required = true) String codigoGenerado,
            @RequestParam(value = "fechaRegistro", required = true) String fechaRegistro,
            @RequestParam(value = "horaRegistro", required = true) String horaRegistro,
            @RequestParam(value = "tipoDocumentoAfiliado", required = true) String tipoDocumentoAfiliado,
            @RequestParam(value = "numeroDocumentoAfiliado", required = true) String numeroDocumentoAfiliado,
            @RequestParam(value = "nombreAfiliado", required = true) String nombreAfiliado,
            @RequestParam(value = "tipoDocumentoTramitador", required = true) String tipoDocumentoTramitador,
            @RequestParam(value = "numeroDocumentoTramitador", required = true) String numeroDocumentoTramitador,
            @RequestParam(value = "sede", required = true) String sede,
            @RequestParam(value = "estado", required = true) String estado,
            @RequestParam(value = "soporteAdjunto1", required = false) MultipartFile soporteAdjunto1,
            @RequestParam(value = "soporteAdjunto2", required = false) MultipartFile soporteAdjunto2,
            @RequestParam(value = "soporteformula", required = false) MultipartFile soporteformula
    ) {
        try {
            // Crear subdirectorio para los archivos del trámite
            String subDirectorio = tipoDocumentoAfiliado + "_" + numeroDocumentoAfiliado + "_" + codigoGenerado;

// Subir archivos al servidor SFTP si existen
            String rutaSoporte1 = null;
            String rutaSoporte2 = null;
            String rutaformula = null;

            if (soporteAdjunto1 != null && !soporteAdjunto1.isEmpty()) {
                // Crear un nombre personalizado para el archivo frontal
                String nombrePersonalizado = tipoDocumentoAfiliado + "_" + numeroDocumentoAfiliado + "_FRONTAL";
                rutaSoporte1 = archivoServicio.guardarArchivoConNombre(soporteAdjunto1, subDirectorio, nombrePersonalizado);
            }

            if (soporteAdjunto2 != null && !soporteAdjunto2.isEmpty()) {
                // Crear un nombre personalizado para el archivo posterior
                String nombrePersonalizado = tipoDocumentoAfiliado + "_" + numeroDocumentoAfiliado + "_POSTERIOR";
                rutaSoporte2 = archivoServicio.guardarArchivoConNombre(soporteAdjunto2, subDirectorio, nombrePersonalizado);
            }

            if (soporteformula != null && !soporteformula.isEmpty()){
                //nombrepara la formula
                String nombrePersonalizado = tipoDocumentoAfiliado + "_" + numeroDocumentoAfiliado + "_" + codigoGenerado +  "_FORMULA";
                rutaformula = archivoServicio.guardarArchivoConNombre(soporteformula, subDirectorio, nombrePersonalizado);

            }

            // Crear objeto Registroafiliado
            Registroafiliado registroafiliado = new Registroafiliado();
            registroafiliado.setCodigoGenerado(codigoGenerado);
            registroafiliado.setFechaRegistro(LocalDate.parse(fechaRegistro));
            registroafiliado.setHoraRegistro(LocalTime.parse(horaRegistro));
            registroafiliado.setTipoDocumentoAfiliado(tipoDocumentoAfiliado);
            registroafiliado.setNumeroDocumentoAfiliado(numeroDocumentoAfiliado);
            registroafiliado.setNombreAfiliado(nombreAfiliado);
            registroafiliado.setSoporteAdjunto1(rutaSoporte1);
            registroafiliado.setSoporteAdjunto2(rutaSoporte2);
            registroafiliado.setTipoDocumentoTramitador(tipoDocumentoTramitador);
            registroafiliado.setNumeroDocumentoTramitador(numeroDocumentoTramitador);
            registroafiliado.setSede(sede);
            registroafiliado.setEstado(estado);
            registroafiliado.setSoporteformula(rutaformula);

            // Guardar en la base de datos
            Registroafiliado nuevoRegistro = registroafiliadoServicio.createregistro(registroafiliado);
            return new ResponseEntity<>(nuevoRegistro, HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Mantener los demás métodos igual que antes
    @GetMapping
    public ResponseEntity<List<Registroafiliado>> obtenerTodosLosRegistros() {
        List<Registroafiliado> registros = registroafiliadoServicio.getAllRegistroafiliado();
        return new ResponseEntity<>(registros, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registroafiliado> obtenerRegistroPorId(@PathVariable String id) {
        Registroafiliado registro = registroafiliadoServicio.getregistroById(id);
        if (registro != null) {
            return new ResponseEntity<>(registro, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Registroafiliado> actualizarRegistro(@PathVariable String id, @RequestBody Registroafiliado registroafiliado) {
        Registroafiliado registroActualizado = registroafiliadoServicio.updateregistro(id, registroafiliado);
        if (registroActualizado != null) {
            return new ResponseEntity<>(registroActualizado, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable String id) {
        registroafiliadoServicio.deleteregistro(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}