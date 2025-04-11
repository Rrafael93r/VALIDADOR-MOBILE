package com.validaor.api.Servicios;


import com.jcraft.jsch.*;
import com.validaor.api.Config.SftpConfiguracion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;


@Service
public class ArchivoServicio {

    private static final Logger logger = Logger.getLogger(ArchivoServicio.class.getName());

    @Autowired
    private SftpConfiguracion sftpConfiguracion;

    // Directorio temporal para almacenar archivos antes de subirlos al SFTP
    private final String TEMP_DIR = "temp/";

    /**
     * Guarda un archivo en el servidor SFTP con un nombre personalizado
     * @param file Archivo a subir
     * @param subDirectorio Subdirectorio dentro de la ruta base SFTP
     * @param nombrePersonalizado Nombre personalizado para el archivo (sin extensión)
     * @return Ruta del archivo en el servidor SFTP o null si hay error
     */
    public String guardarArchivoConNombre(MultipartFile file, String subDirectorio, String nombrePersonalizado) {
        try {
            // Crear directorio temporal si no existe
            File tempDir = new File(TEMP_DIR);
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            // Obtener la extensión del archivo original
            String nombreOriginal = file.getOriginalFilename();
            String extension = "";
            if (nombreOriginal != null && nombreOriginal.contains(".")) {
                extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            }

            // Generar nombre de archivo con formato personalizado
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String nombreArchivo = nombrePersonalizado + "_" + timestamp + extension;

            // Guardar archivo temporalmente
            String rutaTemporal = TEMP_DIR + nombreArchivo;
            File archivoTemporal = new File(rutaTemporal);

            try (FileOutputStream fos = new FileOutputStream(archivoTemporal)) {
                fos.write(file.getBytes());
            }

            // Construir ruta SFTP
            String rutaSftp = sftpConfiguracion.getBasePath();
            if (subDirectorio != null && !subDirectorio.isEmpty()) {
                rutaSftp += (rutaSftp.endsWith("/") ? "" : "/") + subDirectorio;
            }

            // Subir archivo al servidor SFTP
            String resultado = uploadSFTP(
                    rutaTemporal,
                    sftpConfiguracion.getHost(),
                    sftpConfiguracion.getUsername(),
                    sftpConfiguracion.getPassword(),
                    sftpConfiguracion.getPort(),
                    rutaSftp,
                    nombreArchivo // Pasar el nombre personalizado
            );

            // Eliminar archivo temporal
            Files.deleteIfExists(archivoTemporal.toPath());

            if ("200".equals(resultado)) {
                // Devolver la ruta completa del archivo en el servidor SFTP
                return rutaSftp + (rutaSftp.endsWith("/") ? "" : "/") + nombreArchivo;
            } else {
                logger.log(Level.SEVERE, "Error al subir archivo al servidor SFTP. Código: " + resultado);
                return null;
            }
        } catch (IOException e) {
            logger.log(Level.SEVERE, "Error al procesar el archivo", e);
            return null;
        }
    }

    /**
     * Método original para mantener compatibilidad
     */
    public String guardarArchivo(MultipartFile file, String subDirectorio) {
        // Generar un nombre único basado en UUID
        String nombreUnico = UUID.randomUUID().toString();
        return guardarArchivoConNombre(file, subDirectorio, nombreUnico);
    }

    /**
     * Sube un archivo al servidor SFTP con un nombre específico
     */
    public String uploadSFTP(String ruta, String sftpHost, String sftpUserName, String sftpPassword, int sftpPort, String sftpPath, String nombreArchivo) {
        String datofinal = "";
        Session session = null;
        Channel channel = null;
        ChannelSftp channelSftp = null;
        try {
            JSch jsch = new JSch();
            session = jsch.getSession(sftpUserName, sftpHost, sftpPort);
            session.setPassword(sftpPassword);
            Properties config = new Properties();
            config.put("StrictHostKeyChecking", "no");
            session.setConfig(config);
            session.connect(30000); // Timeout de 30 segundos
            channel = session.openChannel("sftp");
            channel.connect();
            channelSftp = (ChannelSftp) channel;

            // Crear el directorio si no existe
            try {
                channelSftp.cd(sftpPath);
            } catch (SftpException e) {
                String[] folders = sftpPath.split("/");
                StringBuilder path = new StringBuilder();
                for (String folder : folders) {
                    if (folder.length() > 0) {
                        path.append("/").append(folder);
                        try {
                            channelSftp.cd(path.toString());
                        } catch (SftpException ex) {
                            channelSftp.mkdir(path.toString());
                            channelSftp.cd(path.toString());
                        }
                    }
                }
            }

            // Usar el nombre personalizado en lugar del nombre original del archivo
            channelSftp.put(ruta, nombreArchivo);
            datofinal = "200";

        } catch (JSchException e) {
            logger.log(Level.SEVERE, "Error de conexión SFTP", e);
            datofinal = "400";
        } catch (SftpException e) {
            logger.log(Level.SEVERE, "Error en la transferencia de archivos SFTP", e);
            datofinal = "400";
        } finally {
            if (channelSftp != null && channelSftp.isConnected()) {
                channelSftp.disconnect();
            }
            if (channel != null && channel.isConnected()) {
                channel.disconnect();
            }
            if (session != null && session.isConnected()) {
                session.disconnect();
            }
        }
        return datofinal;
    }

    /**
     * Método original para mantener compatibilidad
     */
    public String uploadSFTP(String ruta, String sftpHost, String sftpUserName, String sftpPassword, int sftpPort, String sftpPath) {
        File file = new File(ruta);
        return uploadSFTP(ruta, sftpHost, sftpUserName, sftpPassword, sftpPort, sftpPath, file.getName());
    }
}
