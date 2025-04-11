package com.validaor.api.Modelo;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tramitador")
public class Tramitador {

    @Id
    @Column(name = "identificacion", length = 200, nullable = false)
    private String identificacion;

    @Column(name = "tipoidentificacion", length = 200, nullable = false)
    private String tipoIdentificacion;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "perfil")
    private String perfil;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "soporte_adjunto1")
    private String soporteAdjunto1;

    @Column(name = "soporte_adjunto2")
    private String soporteAdjunto2;

    @Column(name = "estado")
    private String estado;

    @Column(name = "usuario", length = 200, nullable = false, unique = true)
    private String usuario;

    @Column(name = "contrasena")
    private String contrasena;

    public String getIdentificacion() {
        return identificacion;
    }


    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getTipoIdentificacion() {
        return tipoIdentificacion;
    }

    public void setTipoIdentificacion(String tipoIdentificacion) {
        this.tipoIdentificacion = tipoIdentificacion;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }



    public String getSoporteAdjunto1() {
        return soporteAdjunto1;
    }

    public void setSoporteAdjunto1(String soporteAdjunto) {
        this.soporteAdjunto1 = soporteAdjunto;
    }

    public String getSoporteAdjunto2() {
        return soporteAdjunto2;
    }

    public void setSoporteAdjunto2(String soporteAdjunto2) {
        this.soporteAdjunto2 = soporteAdjunto2;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}
