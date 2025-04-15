package com.validaor.api.Servicios;

import org.springframework.stereotype.Service;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonArray;
import okhttp3.*;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class ValidarDerechoServicio {



    private static final String AUTH_URL = "https://gcp-mutualser-keycloak-prod.appspot.com/auth/realms/right-validation/protocol/openid-connect/token";
    private static final String VALIDATE_URL = "https://validador-derechos.mutualser.com/validateRights/";


    private static final String USERNAME = "pharmaser-prevrenal";
    private static final String PASSWORD = "Ph4rM453rPr3Vr3N41";
    private static final String SECRET = "9bfa90db-b9e1-48ea-9b3e-403e6993f346";
    private static final String CLIENT_ID = "right-validation";

    public String validarDocumento(String tipoDocumento, String numeroDocumento) throws Exception {
        // Obtener token
        String token = generarToken(PASSWORD, USERNAME, SECRET, CLIENT_ID);
        if (token == null || token.isEmpty()) {
            throw new Exception("No se pudo obtener el token de autenticación");
        }

        // Consultar información del paciente
        return consultaNueva(token, tipoDocumento, numeroDocumento);
    }

    private String generarToken(String pass, String usu, String secret, String cliente_id) {
        String dat = "";
        try {
            OkHttpClient client = new OkHttpClient().newBuilder().build();
            MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");
            RequestBody body = RequestBody.create(mediaType,
                    "grant_type=password&client_secret=" + secret +
                            "&client_id=" + cliente_id +
                            "&username=" + usu +
                            "&password=" + pass);

            Request request = new Request.Builder()
                    .url(AUTH_URL)
                    .method("POST", body)
                    .addHeader("Content-Type", "application/x-www-form-urlencoded")
                    .build();

            Response response = client.newCall(request).execute();
            if (response.code() == 200) {
                String jsonData = response.body().string();
                JSONObject json = new JSONObject(jsonData);
                dat = json.getString("access_token");
            }
        } catch (Exception ex) {
            Logger.getLogger(ValidarDerechoServicio.class.getName()).log(Level.SEVERE, null, ex);
        }
        return dat;
    }

    private String consultaNueva(String token, String tipid, String ident) {
        String textoretorna = "";
        try {
            OkHttpClient client = new OkHttpClient().newBuilder().build();
            MediaType mediaType = MediaType.parse("application/json");
            String jsonBody = "{\r\n    \"resourceType\": \"Parameters\",\r\n    \"id\": \"CorrelationId\",\r\n    \"parameter\": [\r\n        {\r\n            \"name\": \"documentType\",\r\n            \"valueString\": \"" + tipid + "\"\r\n        },\r\n        {\r\n            \"name\": \"documentId\",\r\n            \"valueString\": \"" + ident + "\"\r\n        }\r\n    ]\r\n}";

            RequestBody body = RequestBody.create(mediaType, jsonBody);
            Request request = new Request.Builder()
                    .url(VALIDATE_URL)
                    .method("POST", body)
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Accept", "*/*")
                    .addHeader("Authorization", "Bearer " + token)
                    .build();

            Response response = client.newCall(request).execute();
            if (response.code() == 200) {
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(response.body().string(), JsonObject.class);
                JSONArray jsonArray = new JSONArray(jsonObject.get("entry").toString());

                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jjj = jsonArray.getJSONObject(i);
                    if (i == 0) {
                        // Cambio aquí: obtenemos resource como JSONObject en lugar de String
                        JSONObject resourceObj = jjj.getJSONObject("resource");

                        // Convertimos el JSONObject a String para procesarlo con Gson
                        String json = resourceObj.toString();

                        // Extraer información del paciente usando GSON
                        JsonObject jsonObjectx2 = JsonParser.parseString(json).getAsJsonObject();

                        // Extraer estado de afiliación y régimen
                        if (jsonObjectx2.has("extension")) {
                            JsonArray extensions = jsonObjectx2.getAsJsonArray("extension");
                            String estado = "";
                            String regimen = "";

                            for (int j = 0; j < extensions.size(); j++) {
                                JsonObject extension = extensions.get(j).getAsJsonObject();
                                String url = extension.get("url").getAsString();

                                if (url.equals("mutualSER/hl7/patient/afilliateStatus")) {
                                    estado = extension.getAsJsonObject("valueCoding").get("display").getAsString();
                                }

                                if (url.equals("mutualSER/hl7/patient/healthModality")) {
                                    regimen = extension.getAsJsonObject("valueCoding").get("display").getAsString();
                                }
                            }

                            textoretorna = estado + "|" + regimen;
                        }

                        // Extraer nombre
                        if (jsonObjectx2.has("name")) {
                            JsonArray nameArray = jsonObjectx2.getAsJsonArray("name");
                            if (nameArray.size() > 0) {
                                JsonObject nameObject = nameArray.get(0).getAsJsonObject();
                                if (nameObject.has("text")) {
                                    String nombre = nameObject.get("text").getAsString();
                                    textoretorna = textoretorna + "|" + nombre;
                                }
                            }
                        }

                        return textoretorna;
                    }
                    break;
                }
            }
        } catch (Exception ex) {
            Logger.getLogger(ValidarDerechoServicio.class.getName()).log(Level.SEVERE, null, ex);
        }
        return textoretorna;
    }

}
