import { drive } from "../services/drive.js";
import {
  shareFolderWithPersonalAccount,
  createFolder,
  sendFileToDrive,
  deleteFile,
  getIdByUrl,
} from "../services/helpers-drive.js";
import { Proyecto } from "../models/Proyecto.js";
import { Evaluador } from "../models/Evaluador.js";
import { Docente } from "../models/Docente.js";
import { generarNotificacion, tipo_notificacion } from "../helpers/generarNotificacion.js";

export const UploadFiles = async (uid, id_proyecto, files , name_files) => {
  
  const proyecto = await Proyecto.findById(id_proyecto);
  
  try {

    const name_folder = proyecto.titulo;
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

    const [
      id_archivo_pdf,
      id_archivo_pdf_campo,
      id_archivo_informeTrabajo,
      id_archivo_autorizacionImagen,
    ] = await Promise.all(uploadPromises);

    proyecto.registroPedagogico = `https://drive.google.com/file/d/${id_archivo_pdf}/preview`;
    proyecto.carpetaCampo = `https://drive.google.com/file/d/${id_archivo_pdf_campo}/preview`;
    proyecto.informeTrabajo = `https://drive.google.com/file/d/${id_archivo_informeTrabajo}/preview`;
    proyecto.autorizacionImagen = `https://drive.google.com/file/d/${id_archivo_autorizacionImagen}/preview`;

    if (
      id_archivo_pdf &&
      id_archivo_pdf_campo &&
      id_archivo_informeTrabajo &&
      id_archivo_autorizacionImagen
    ) {
      proyecto.nameCarpetaCampo = files.carpetaCampo.originalFilename;
      proyecto.nameAutorizacionImagen = files.autorizacionImagen.originalFilename;
      proyecto.nameRegistroPedagogicopdf = files.registroPedagogicopdf.originalFilename;
      proyecto.nameInformeTrabajo = files.informeTrabajo.originalFilename;
      await proyecto.save();
      await generarNotificacion(uid, tipo_notificacion.carga_exitosa_proyecto(proyecto.titulo))
    } else {
      throw new Error(`No se han podido cargar los documentos de proyecto`);
    }

  } catch (error) {

    console.error(error);
    if(proyecto){
      await generarNotificacion(uid, tipo_notificacion.carga_fallida_proyecto(proyecto.titulo))
    }

  }
};

export const UpdateFiles = async (uid, id , files , name_files) => {
  
  const proyecto = await Proyecto.findById(id);
  
  try {

    const id_folder = proyecto.id_carpeta_drive;
    let id_archivo_pdf = null;
    let id_carpeta_campo = null;
    let id_informe_trabajo = null;
    let id_autorizacion_imagen = null;

    const processFile = async (file, existingFile , name_original) => {
      if (file) {
        if (existingFile) {
          const id = await getIdByUrl(existingFile);
          if (id) {
            const deleteResult = await deleteFile(id, drive);
            if (deleteResult) {
              proyecto[name_original] = file.originalFilename;
              await proyecto.save();
              return await sendFileToDrive(file, id_folder, drive);
            }
          }
        } else {
          proyecto[name_original] = file.originalFilename;

          return await sendFileToDrive(file, id_folder, drive);
        }
      }
      return null;
    };

    id_archivo_pdf = await processFile(
      files.registroPedagogicopdf,
      proyecto.registroPedagogico,
      'nameRegistroPedagogicopdf'
    );

    id_carpeta_campo = await processFile(
      files.carpetaCampo,
      proyecto.carpetaCampo,
      'nameCarpetaCampo'

    );

    id_informe_trabajo = await processFile(
      files.informeTrabajo,
      proyecto.informeTrabajo,
      'nameInformeTrabajo'

    );

    id_autorizacion_imagen = await processFile(
      files.autorizacionImagen,
      proyecto.autorizacionImagen,
      'nameAutorizacionImagen'

    );

    if (
      id_archivo_pdf ||
      id_carpeta_campo ||
      id_autorizacion_imagen ||
      id_informe_trabajo
    ) {
      proyecto.registroPedagogico = id_archivo_pdf
        ? `https://drive.google.com/file/d/${id_archivo_pdf}/preview`
        : proyecto.registroPedagogico;
      proyecto.carpetaCampo = id_carpeta_campo
        ? `https://drive.google.com/file/d/${id_carpeta_campo}/preview`
        : proyecto.carpetaCampo;
      proyecto.informeTrabajo = id_informe_trabajo
        ? `https://drive.google.com/file/d/${id_informe_trabajo}/preview`
        : proyecto.informeTrabajo;
      proyecto.autorizacionImagen = id_autorizacion_imagen
        ? `https://drive.google.com/file/d/${id_autorizacion_imagen}/preview`
        : proyecto.autorizacionImagen;

      
      await proyecto.save();
      await generarNotificacion(uid, tipo_notificacion.carga_exitosa_proyecto(proyecto.titulo))
    } else {
      await generarNotificacion(uid, tipo_notificacion.carga_fallida_proyecto(proyecto.titulo))
      throw new Error(`NO SE PUDO CARGAR LOS DOCUMENTOS.`);
    }

  } catch (error) {

    console.error(error);

    if(proyecto){
      await generarNotificacion(uid, tipo_notificacion.carga_fallida_proyecto(proyecto.titulo))
    }

  }
}

// export const fileWorker = async (job, done) => {
//   try {
//     const { id_proyecto, files } = job.data;
//     //busco el proyecto que pertenece ese id
//     const proyecto = await Proyecto.findById(id_proyecto);

//     const name_folder = proyecto.titulo;
//     console.log("test archivos", files);
//     console.log(proyecto);
//     //creo la nueva carpeta
//     const id_folder_new = await createFolder(name_folder, drive);

//     //seteo el campo del proyecto "id_carpeta_drive" con el "id" de la carpeta creada
//     proyecto.id_carpeta_drive = id_folder_new;
//     console.log(proyecto.id_carpeta_drive);
//     // Compartir la carpeta creada en paralelo
//     const email_ciencia_conecta = "cienciaconecta.utn@gmail.com";
//     await Promise.all([
//       shareFolderWithPersonalAccount(
//         id_folder_new,
//         email_ciencia_conecta,
//         drive,
//         "writer"
//       ),
//     ]);

//     const uploadPromises = [];

//     // Subir los archivos en paralelo
//     uploadPromises.push(
//       sendFileToDrive(files.registroPedagogicopdf, id_folder_new, drive)
//     );
//     uploadPromises.push(
//       sendFileToDrive(files.carpetaCampo, id_folder_new, drive)
//     );
//     uploadPromises.push(
//       sendFileToDrive(files.informeTrabajo, id_folder_new, drive)
//     );
//     uploadPromises.push(
//       sendFileToDrive(files.autorizacionImagen, id_folder_new, drive)
//     );

//     const [
//       id_archivo_pdf,
//       id_archivo_pdf_campo,
//       id_archivo_informeTrabajo,
//       id_archivo_autorizacionImagen,
//     ] = await Promise.all(uploadPromises);

//     proyecto.registroPedagogico = `https://drive.google.com/file/d/${id_archivo_pdf}/preview`;
//     proyecto.carpetaCampo = `https://drive.google.com/file/d/${id_archivo_pdf_campo}/preview`;
//     proyecto.informeTrabajo = `https://drive.google.com/file/d/${id_archivo_informeTrabajo}/preview`;
//     proyecto.autorizacionImagen = `https://drive.google.com/file/d/${id_archivo_autorizacionImagen}/preview`;

//     if (
//       id_archivo_pdf &&
//       id_archivo_pdf_campo &&
//       id_archivo_informeTrabajo &&
//       id_archivo_autorizacionImagen
//     ) {
//       await proyecto.save();
//       done();
//     } else {
//       done();
//     }
//   } catch (error) {
//     console.error(error);
//     done(error);
//   }
// };

// export const ActualizarDocumentsWotker = async (job, done) => {
//   try {
//     const { id, files } = job.data;
//     const proyecto = await Proyecto.findById(id);
//     console.log(proyecto.id_carpeta_drive);
//     const id_folder = proyecto.id_carpeta_drive;
//     let id_archivo_pdf = null;
//     let id_carpeta_campo = null;
//     let id_informe_trabajo = null;
//     let id_autorizacion_imagen = null;

//     const processFile = async (file, existingFile) => {
//       if (file) {
//         if (existingFile) {
//           const id = await getIdByUrl(existingFile);
//           if (id) {
//             const deleteResult = await deleteFile(id, drive);
//             if (deleteResult) {
//               return await sendFileToDrive(file, id_folder, drive);
//             }
//           }
//         } else {
//           return await sendFileToDrive(file, id_folder, drive);
//         }
//       }
//       return null;
//     };

//     id_archivo_pdf = await processFile(
//       files.registroPedagogicopdf,
//       proyecto.registroPedagogico
//     );

//     id_carpeta_campo = await processFile(
//       files.carpetaCampo,
//       proyecto.carpetaCampo
//     );

//     id_informe_trabajo = await processFile(
//       files.informeTrabajo,
//       proyecto.informeTrabajo
//     );

//     id_autorizacion_imagen = await processFile(
//       files.autorizacionImagen,
//       proyecto.autorizacionImagen
//     );

//     if (
//       id_archivo_pdf ||
//       id_carpeta_campo ||
//       id_autorizacion_imagen ||
//       id_informe_trabajo
//     ) {
//       proyecto.registroPedagogico = id_archivo_pdf
//         ? `https://drive.google.com/file/d/${id_archivo_pdf}/preview`
//         : proyecto.registroPedagogico;
//       proyecto.carpetaCampo = id_carpeta_campo
//         ? `https://drive.google.com/file/d/${id_carpeta_campo}/preview`
//         : proyecto.carpetaCampo;
//       proyecto.informeTrabajo = id_informe_trabajo
//         ? `https://drive.google.com/file/d/${id_informe_trabajo}/preview`
//         : proyecto.informeTrabajo;
//       proyecto.autorizacionImagen = id_autorizacion_imagen
//         ? `https://drive.google.com/file/d/${id_autorizacion_imagen}/preview`
//         : proyecto.autorizacionImagen;
//       await proyecto.save();
//       done();
//     } else {
//       done();
//     }
//   } catch (error) {
//     console.error(error);
//     done(error);
//   }
// };



export const UploadCv = async (job, done) => {
  
  const { uid, files } = job.data;

  const _docente = await Docente.findOne({ usuario: uid });
  const evaluador = await Evaluador.findOne({ idDocente: _docente.id });
  
  try {

    const name_folder = _docente.cuil;
    //creo la nueva carpeta
    const id_folder_new = await createFolder(name_folder, drive);

    if (id_folder_new) {

      evaluador.id_carpeta_cv = id_folder_new;

      // Compartir la carpeta creada en paralelo
      const email_ciencia_conecta = "cienciaconecta.utn@gmail.com";

      await shareFolderWithPersonalAccount(
        id_folder_new,
        email_ciencia_conecta,
        drive,
        "writer"
      );

      const id_cv = await sendFileToDrive(files.cv, id_folder_new, drive);

      if (id_cv) {
        evaluador.CV = `${id_cv}`;
        await evaluador.save();
        await generarNotificacion(uid, tipo_notificacion.carga_exitosa_cv)
        done();

      } else {
        throw new Error("No se ha podido cargar el archivo en Drive");
      }

    } else {
      throw new Error("No se ha podido crear la carpeta en Drive");
    }

  } catch (error) {

    console.error(error);

    if (_docente && evaluador) {
      await generarNotificacion(uid, tipo_notificacion.carga_fallida_cv);
      await evaluador.deleteOne();
    }

    done(error);

  }
};
