package com.validaor.api.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3074") // local -> meg
                .allowedOrigins("http://localhost:5173") // local -> zafiro
                .allowedOrigins("http://10.0.1.249:7839") // test -> zafiro
                .allowedOrigins("https://testingmeg.pharmaser.com.co") // test -> meg
                .allowedOrigins("https://meg.pharmaser.com.co") // prod -> meg
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Tiempo de cache para las respuestas pre-flight
    }
}