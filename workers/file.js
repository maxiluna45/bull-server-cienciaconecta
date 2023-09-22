import { drive } from "../services/drive.js"
import { shareFolderWithPersonalAccount , createFolder , sendFileToDrive} from "../services/helpers-drive.js"
import {Proyecto} from "../models/Proyecto.js";

export const fileWorker = async(job , done) => {
    try {
        const { id_proyecto , files  } = job.data;
          //busco el proyecto que pertenece ese id
        const proyecto = await Proyecto.findById(id_proyecto);

        const name_folder = proyecto.titulo;
        console.log('test archivos' , files);
        console.log(proyecto);
        //creo la nueva carpeta
        const id_folder_new = await createFolder(name_folder, drive);

      //seteo el campo del proyecto "id_carpeta_drive" con el "id" de la carpeta creada
        proyecto.id_carpeta_drive = id_folder_new;

      // Compartir la carpeta creada en paralelo
      const email_ciencia_conecta = "cienciaconecta.utn@gmail.com";
      await Promise.all([
        shareFolderWithPersonalAccount(
          id_folder_new,
          email_ciencia_conecta,
          drive,
          "writer"
        ),
      ]);

      const uploadPromises = [];

      // Subir los archivos en paralelo
      uploadPromises.push(
        sendFileToDrive(files.registroPedagogicopdf, id_folder_new, drive)
      );
      uploadPromises.push(
        sendFileToDrive(files.carpetaCampo, id_folder_new, drive)
      );
      uploadPromises.push(
        sendFileToDrive(files.informeTrabajo, id_folder_new, drive)
      );
      uploadPromises.push(
        sendFileToDrive(files.autorizacionImagen, id_folder_new, drive)
      );

      const [id_archivo_pdf, id_archivo_pdf_campo, id_archivo_informeTrabajo, id_archivo_autorizacionImagen] =
        await Promise.all(uploadPromises);

      proyecto.registroPedagogico = `https://drive.google.com/file/d/${id_archivo_pdf}/preview`;
      proyecto.carpetaCampo = `https://drive.google.com/file/d/${id_archivo_pdf_campo}/preview`;
      proyecto.informeTrabajo = `https://drive.google.com/file/d/${id_archivo_informeTrabajo}/preview`;
      proyecto.autorizacionImagen = `https://drive.google.com/file/d/${id_archivo_autorizacionImagen}/preview`;

      if (id_archivo_pdf && id_archivo_pdf_campo && id_archivo_informeTrabajo && id_archivo_autorizacionImagen) {
        proyecto.save();
        done();

      } else {
        done();
      }
    } catch (error) {
        console.error(error);
        done(error);

    }
}