package com.validaor.api.Servicios;

import com.google.gson.*;
import java.util.Optional;

public class AfiliadoParser {

    public static String procesarRespuesta(String responseBody) throws Exception {
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(responseBody, JsonObject.class);
        JsonArray entryArray = jsonObject.getAsJsonArray("entry");

        if (entryArray == null || entryArray.size() == 0) {
            throw new IllegalArgumentException("La respuesta no contiene datos de entrada válidos.");
        }

        // Obtener el recurso Patient
        JsonObject patientResource = entryArray.get(0).getAsJsonObject()
                .getAsJsonObject("resource");

        // Validar si el afiliado está activo
        String estadoAfiliacion = obtenerEstadoAfiliacion(patientResource);
        if (!"ACTIVO".equalsIgnoreCase(estadoAfiliacion)) {
            throw new IllegalStateException("El afiliado no está activo. Estado: " + estadoAfiliacion);
        }

        // Extraer los datos requeridos
        String tipoDocumento = obtenerTipoDocumento(patientResource);
        String numeroDocumento = obtenerNumeroDocumento(patientResource);
        String primerApellido = obtenerPrimerApellido(patientResource);
        String segundoApellido = obtenerSegundoApellido(patientResource);
        String primerNombre = obtenerPrimerNombre(patientResource);
        String segundoNombre = obtenerSegundoNombre(patientResource);
        String telefonoFijo = obtenerTelefonoFijo(patientResource);
        String telefonoMovil = obtenerTelefonoMovil(patientResource);

        // Construir la respuesta
        return String.join("|",
                tipoDocumento,
                numeroDocumento,
                primerApellido,
                segundoApellido,
                primerNombre,
                segundoNombre,
                telefonoFijo,
                telefonoMovil
        );
    }

    private static String obtenerEstadoAfiliacion(JsonObject resource) {
        JsonArray extensionArray = resource.getAsJsonArray("extension");
        for (JsonElement extensionElement : extensionArray) {
            JsonObject extension = extensionElement.getAsJsonObject();
            String url = extension.get("url").getAsString();
            if ("mutualSER/hl7/patient/afilliateStatus".equals(url)) {
                return extension.getAsJsonObject("valueCoding").get("display").getAsString();
            }
        }
        throw new IllegalArgumentException("No se encontró el estado de afiliación.");
    }

    private static String obtenerTipoDocumento(JsonObject resource) {
        JsonArray identifierArray = resource.getAsJsonArray("identifier");
        for (JsonElement identifierElement : identifierArray) {
            JsonObject identifier = identifierElement.getAsJsonObject();
            String typeCode = identifier.getAsJsonObject("type")
                    .getAsJsonArray("coding").get(0)
                    .getAsJsonObject().get("code").getAsString();
            if ("DT".equals(typeCode)) {
                return identifier.get("value").getAsString();
            }
        }
        throw new IllegalArgumentException("No se encontró el tipo de documento.");
    }

    private static String obtenerNumeroDocumento(JsonObject resource) {
        JsonArray identifierArray = resource.getAsJsonArray("identifier");
        for (JsonElement identifierElement : identifierArray) {
            JsonObject identifier = identifierElement.getAsJsonObject();
            String typeCode = identifier.getAsJsonObject("type")
                    .getAsJsonArray("coding").get(0)
                    .getAsJsonObject().get("code").getAsString();
            if ("DI".equals(typeCode)) {
                return identifier.get("value").getAsString();
            }
        }
        throw new IllegalArgumentException("No se encontró el número de documento.");
    }

    private static String obtenerPrimerApellido(JsonObject resource) {
        JsonArray nameArray = resource.getAsJsonArray("name");
        if (nameArray.size() > 0) {
            JsonObject nameObject = nameArray.get(0).getAsJsonObject();
            String family = nameObject.get("family").getAsString();
            String[] apellidos = family.split("\\|");
            return apellidos[0].split("=")[1]; // Primer apellido
        }
        throw new IllegalArgumentException("No se encontraron apellidos.");
    }

    private static String obtenerSegundoApellido(JsonObject resource) {
        JsonArray nameArray = resource.getAsJsonArray("name");
        if (nameArray.size() > 0) {
            JsonObject nameObject = nameArray.get(0).getAsJsonObject();
            String family = nameObject.get("family").getAsString();
            String[] apellidos = family.split("\\|");
            if (apellidos.length > 1) {
                return apellidos[1].split("=")[1]; // Segundo apellido
            }
        }
        return ""; // No hay segundo apellido
    }

    private static String obtenerPrimerNombre(JsonObject resource) {
        JsonArray nameArray = resource.getAsJsonArray("name");
        if (nameArray.size() > 0) {
            JsonObject nameObject = nameArray.get(0).getAsJsonObject();
            JsonArray givenArray = nameObject.getAsJsonArray("given");
            if (givenArray.size() > 0) {
                return givenArray.get(0).getAsString(); // Primer nombre
            }
        }
        throw new IllegalArgumentException("No se encontraron nombres.");
    }

    private static String obtenerSegundoNombre(JsonObject resource) {
        JsonArray nameArray = resource.getAsJsonArray("name");
        if (nameArray.size() > 0) {
            JsonObject nameObject = nameArray.get(0).getAsJsonObject();
            JsonArray givenArray = nameObject.getAsJsonArray("given");
            if (givenArray.size() > 1) {
                return givenArray.get(1).getAsString(); // Segundo nombre
            }
        }
        return ""; // No hay segundo nombre
    }

    private static String obtenerTelefonoFijo(JsonObject resource) {
        JsonArray telecomArray = resource.getAsJsonArray("telecom");
        for (JsonElement telecomElement : telecomArray) {
            JsonObject telecom = telecomElement.getAsJsonObject();
            String system = telecom.get("system").getAsString();
            String use = telecom.get("use").getAsString();
            if ("phone".equals(system) && "home".equals(use)) {
                return Optional.ofNullable(telecom.get("value"))
                        .map(JsonElement::getAsString)
                        .orElse("");
            }
        }
        return ""; // No hay teléfono fijo
    }

    private static String obtenerTelefonoMovil(JsonObject resource) {
        JsonArray telecomArray = resource.getAsJsonArray("telecom");
        for (JsonElement telecomElement : telecomArray) {
            JsonObject telecom = telecomElement.getAsJsonObject();
            String system = telecom.get("system").getAsString();
            String use = telecom.get("use").getAsString();
            if ("phone".equals(system) && "mobile".equals(use)) {
                return Optional.ofNullable(telecom.get("value"))
                        .map(JsonElement::getAsString)
                        .orElse("");
            }
        }
        return ""; // No hay teléfono móvil
    }
}
