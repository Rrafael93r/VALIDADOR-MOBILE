package com.validaor.api.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:3074", // local → meg
                        "http://localhost:5173", // local → zafiro
                        "http://10.0.1.249:7839", // test → zafiro
                        "https://testingmeg.pharmaser.com.co", // test → meg
                        "https://meg.pharmaser.com.co" // prod → meg
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}