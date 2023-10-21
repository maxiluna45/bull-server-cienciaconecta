import Queue from "bull";
import { config } from "./config/index.js";
import {fileWorker , ActualizarDocumentsWotker , UploadCv, UpdateFiles, UploadFiles} from "./workers/file.js";

import  { sendAltaEmailTo,  sendConfirmationEmailTo, sendSeleccionEmailTo, sendRecoveryEmailTo, } from "./workers/email.js"

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

email.process("email:recuperacionContrasena", async (job) => {
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



const file = new Queue("file",{redis: config.redis});
file.process((job, done) => fileWorker(job,done));

const fileUpdate = new Queue("fileUpdate",{redis: config.redis});
fileUpdate.process((job, done) => ActualizarDocumentsWotker(job,done));

const fileCv = new Queue("fileCv",{redis: config.redis});
fileCv.process((job, done) => UploadCv(job,done));



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
      name:"files_",
      hostId:"File Upload/Update Queue Manager",
      redis: config.redis,
    }
];