package com.validaor.api.Modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;



@Entity
@Table(name = "registroafiliado")
public class Registroafiliado {

    @Id
    @Column(name = "codigogenerado")
    private String codigoGenerado;

    @Column(name = "fecharegistro")
    private LocalDate fechaRegistro;

    @Column(name = "horaregistro")
    private LocalTime horaRegistro;

    @Column(name = "tipodocumento_afiliado")
    private String tipoDocumentoAfiliado;

    @Column(name = "numerodocumento_afiliado")
    private String numeroDocumentoAfiliado;

    @Column(name = "nombre_afiliado")
    private String nombreAfiliado;

    @Column(name = "soporteadjunto1")
    private String soporteAdjunto1;

    @Column(name = "soporteadjunto2")
    private String soporteAdjunto2;

    @Column(name = "soporteformula")
    private String soporteformula;

    @Column(name = "tipodocumento_tramitador")
    private String tipoDocumentoTramitador;

    @Column(name = "numerodocumento_tramitador")
    private String numeroDocumentoTramitador;

    @Column(name = "fechaaceptacion")
    private LocalDate fechaAceptacion;

    @Column(name = "horaaceptacion")
    private LocalTime horaAceptacion;

    @Column(name = "sede")
    private String sede;

    @Column(name = "estado")
    private String estado;


    public String getSoporteformula() {
        return soporteformula;
    }

    public void setSoporteformula(String soporteformula) {
        this.soporteformula = soporteformula;
    }

    public String getCodigoGenerado() {
        return codigoGenerado;
    }

    public void setCodigoGenerado(String codigoGenerado) {
        this.codigoGenerado = codigoGenerado;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public LocalTime getHoraRegistro() {
        return horaRegistro;
    }

    public void setHoraRegistro(LocalTime horaRegistro) {
        this.horaRegistro = horaRegistro;
    }

    public String getTipoDocumentoAfiliado() {
        return tipoDocumentoAfiliado;
    }

    public void setTipoDocumentoAfiliado(String tipoDocumentoAfiliado) {
        this.tipoDocumentoAfiliado = tipoDocumentoAfiliado;
    }

    public String getNumeroDocumentoAfiliado() {
        return numeroDocumentoAfiliado;
    }

    public void setNumeroDocumentoAfiliado(String numeroDocumentoAfiliado) {
        this.numeroDocumentoAfiliado = numeroDocumentoAfiliado;
    }

    public String getNombreAfiliado() {
        return nombreAfiliado;
    }

    public void setNombreAfiliado(String nombreAfiliado) {
        this.nombreAfiliado = nombreAfiliado;
    }

    public String getSoporteAdjunto1() {
        return soporteAdjunto1;
    }

    public void setSoporteAdjunto1(String soporteAdjunto1) {
        this.soporteAdjunto1 = soporteAdjunto1;
    }

    public String getSoporteAdjunto2() {
        return soporteAdjunto2;
    }

    public void setSoporteAdjunto2(String soporteAdjunto2) {
        this.soporteAdjunto2 = soporteAdjunto2;
    }

    public String getTipoDocumentoTramitador() {
        return tipoDocumentoTramitador;
    }

    public void setTipoDocumentoTramitador(String tipoDocumentoTramitador) {
        this.tipoDocumentoTramitador = tipoDocumentoTramitador;
    }

    public String getNumeroDocumentoTramitador() {
        return numeroDocumentoTramitador;
    }

    public void setNumeroDocumentoTramitador(String numeroDocumentoTramitador) {
        this.numeroDocumentoTramitador = numeroDocumentoTramitador;
    }

    public LocalDate getFechaAceptacion() {
        return fechaAceptacion;
    }

    public void setFechaAceptacion(LocalDate fechaAceptacion) {
        this.fechaAceptacion = fechaAceptacion;
    }

    public LocalTime getHoraAceptacion() {
        return horaAceptacion;
    }

    public void setHoraAceptacion(LocalTime horaAceptacion) {
        this.horaAceptacion = horaAceptacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getSede() {
        return sede;
    }

    public void setSede(String sede) {
        this.sede = sede;
    }
}
