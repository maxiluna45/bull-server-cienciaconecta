import Queue from "bull";
import { config } from "./config/index.js";
import {fileWorker , ActualizarDocumentsWotker , UploadCv} from "./workers/file.js";

import  { sendAltaEmailTo,  sendConfirmationEmailTo, sendSeleccionEmailTo, sendRecoveryEmailTo, } from "./workers/email.js"
import { modificarEstadosFeria } from "./workers/feria.js";
import { EventEmitter } from 'events';
EventEmitter.setMaxListeners(30)

// Cola para envío de mails ------------------------------------------------------------------------------------------------------
export const email = new Queue("email", { redis: config.redis });
//email.process((job, done) => emailWorker(job, done));

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
    }
];