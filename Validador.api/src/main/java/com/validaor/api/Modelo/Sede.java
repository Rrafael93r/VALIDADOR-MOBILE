package com.validaor.api.Modelo;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sede")
public class Sede {


    @Id
    @Column(name = "incremento")
    Long incremento;


    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "nombresede")
    private String nombresede;

    public Long getIncremento() {
        return incremento;
    }

    public void setIncremento(Long incremento) {
        this.incremento = incremento;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getNombresede() {
        return nombresede;
    }

    public void setNombresede(String nombresede) {
        this.nombresede = nombresede;
    }
}
