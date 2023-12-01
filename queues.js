import Queue from "bull";
import { config } from "./config/index.js";
import {fileWorker , ActualizarDocumentsWotker , UploadCv, UpdateFiles, UploadFiles} from "./workers/file.js";

import  { sendAltaEmailTo,  sendConfirmationEmailTo, sendSeleccionEmailTo, sendRecoveryEmailTo, sendPromocionEmailTo, } from "./workers/email.js"
import { modificarEstadosFeria } from "./workers/feria.js";
import { EventEmitter } from 'events';
import { cancelarEvaluacionRegional, cancelarExposicionProvincial, cancelarExposicionRegional } from "./workers/evaluacion.js";
import { generarNotificacion, tipo_notificacion } from "./helpers/generarNotificacion.js";
import { actualizarEstablecimientosEducativos } from "./workers/establecimientos.js";
EventEmitter.setMaxListeners(30)

// Cola para envío de mails ------------------------------------------------------------------------------------------------------
export const email = new Queue("email", { redis: config.redis });
export const files_ = new Queue("files_", { redis: config.redis });
//email.process((job, done) => emailWorker(job, done));
files_.process("files_:upload", async (job, done) => {
  try {
    const { id, files , name_files } = job.data;
    await UploadFiles(id, files , name_files );
    job.progress(100);
    done()
  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

files_.process("files_:update", async (job, done) => {
  try {
    const { id , files , name_files } = job.data;
    await UpdateFiles(id, files , name_files);
    job.progress(100);
    done()
  } catch (error) {
    job.progress(100); 
    done(error)
  }
});


email.process("email:altaUsuario", async (job, done) => {
  try {
    const { usuario, docente } = job.data;
    await sendAltaEmailTo(usuario, docente);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});


email.process("email:confirmacionUsuario", async (job, done) => {
  try {
    const { tokenConfirm, mail } = job.data;
    await sendConfirmationEmailTo(tokenConfirm, mail);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }

});


email.process("email:seleccionEvaluador", async (job, done) => {
  try {
    const { usuario, docente } = job.data;
    await sendSeleccionEmailTo(usuario, docente);
    job.progress(100);
    done()

  } catch (error) {

    job.progress(100); 
    done(error)

  }
});

email.process("email:recuperacionContrasena", async (job, done) => {
  try {
    const { token, usuario } = job.data;
    await sendRecoveryEmailTo(token, usuario);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

email.process("email:promocionProyecto", async (job, done) => {
  try {
    const { mail, proyecto, id_proyecto, instancia } = job.data;
    await sendPromocionEmailTo(mail, proyecto, id_proyecto, instancia);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

// Colas para envío de archivos -----------------------------------------------------------------------------------------------------------

const file = new Queue("file",{redis: config.redis});
file.process((job, done) => fileWorker(job,done));

const fileUpdate = new Queue("fileUpdate",{redis: config.redis});
fileUpdate.process((job, done) => ActualizarDocumentsWotker(job,done));

const fileCv = new Queue("fileCv",{redis: config.redis});
fileCv.process((job, done) => UploadCv(job,done));


// Colas para Gestionar Estados de Feria por fecha -------------------------------------------------------------------------------------------
const gestor_feria = new Queue("feria", {redis: config.redis});

// Función generica para gestionar las tareas relacionadas a feria
const processFeria = (tipo) => {
  return gestor_feria.process(`feria:${tipo}`, async (job, done) => {
    try {
      const { feria_id } = job.data;
      await modificarEstadosFeria(feria_id, tipo);
      job.progress(100);
      done();
    } catch (error) {
      job.progress(100);
      done(error);
    }
  });
};

// Configurar opciones de cola
const options = {
  attempts: 5, 
  backoff: {
    type: 'exponential',
    delay: 2000, // Retraso inicial en milisegundos
  },
};

// Implementación de los procesos relacionados con cada fecha de la feria que genere un cambio de estado
processFeria('inicioFeria', options);
processFeria('inicioInstanciaEscolar', options);
processFeria('finInstanciaEscolar', options);
processFeria('inicioEvaluacionRegional', options);
processFeria('finEvaluacionRegional', options);
processFeria('inicioExposicionRegional', options);
processFeria('finExposicionRegional', options);
processFeria('promovidosAProvincial', options);
processFeria('inicioExposicionProvincial', options);
processFeria('finExposicionProvincial', options);
processFeria('promovidosANacional', options);
processFeria('finFeria', options);
processFeria('inicioAsignacion', options);
processFeria('cinco_dias_finAsignacion', options);
processFeria('un_dia_finAsignacion', options);
processFeria('cinco_dias_finEvaluacionRegional', options);
processFeria('un_dia_finEvaluacionRegional', options);
processFeria('cinco_dias_finExposicionRegional', options);
processFeria('un_dia_finExposicionRegional', options);
processFeria('cinco_dias_finExposicionProvincial', options);
processFeria('un_dia_finExposicionProvincial', options);


// Colas para Gestionar Evaluaciones -------------------------------------------------------------------------------------------
const gestor_evaluacion = new Queue("evaluacion", {redis: config.redis});

gestor_evaluacion.process("evaluacion:Evaluacion_Regional", async (job, done) => {
  try {
    const { feria_id, proyecto_id } = job.data;
    await cancelarEvaluacionRegional(feria_id, proyecto_id);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

gestor_evaluacion.process("evaluacion:Exposicion_Regional", async (job, done) => {
  try {
    const { feria_id, proyecto_id } = job.data;
    await cancelarExposicionRegional(feria_id, proyecto_id);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

gestor_evaluacion.process("evaluacion:Exposicion_Provincial", async (job, done) => {
  try {
    const { feria_id, proyecto_id } = job.data;
    await cancelarExposicionProvincial(feria_id, proyecto_id);
    job.progress(100);
    done()

  } catch (error) {
    job.progress(100); 
    done(error)
  }
});

// Colas para Gestionar Establecimientos Educativos -------------------------------------------------------------------------------------------
const gestor_establecimientos = new Queue("establecimientos", {redis: config.redis});

gestor_establecimientos.process("establecimientos:actualizar", async (job, done) => {
  try {
    const { uid, files } = job.data;
    const actualizacion = await actualizarEstablecimientosEducativos(files, job);
    if (actualizacion){
      await generarNotificacion(uid, tipo_notificacion.actualizacion_exitosa)
    } else {
      await generarNotificacion(uid, tipo_notificacion.creacion_exitosa)
    }
    job.progress(100);
    done()

  } catch (error) {
    const { uid } = job.data;
    job.progress(100); 
    done(error)
    await generarNotificacion(uid, tipo_notificacion.actualizacion_fallida)
  }
});


// Exportación de colas ----------------------------------------------------------------------------------------------------------------------
export const queues = [
    {
      name: "email",
      hostId: "Email Queue Manager",
      redis: config.redis,
    },
    {
      name:"file",
      hostId:"File Queue Manager",
      redis: config.redis,
    },
    {
      name:"fileUpdate",
      hostId:"File Update Queue Manager",
      redis: config.redis,
    },
    {
      name:"feria",
      hostId:"Feria State Queue Manager",
      redis: config.redis,
    },
    {
      name:"files_",
      hostId:"File Upload/Update Queue Manager",
      redis: config.redis,
    },
    {
      name:"evaluacion",
      hostId:"Evaluaciones Queue Manager",
      redis: config.redis,
    },
    {
      name:"establecimientos",
      hostId:"Establecimientos Educativos Queue Manager",
      redis: config.redis,
    }
];