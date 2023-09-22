import Worker from "bull";
import { altaMailHtml } from "../resources/altaMail.js"
import { transporter } from "../helpers/mailer.js";
import { confirmationMailHtml } from "../resources/confirmationMail.js"
import { recoveryMailHtml } from "../resources/recoveryMail.js"
import { seleccionMailHtml } from "../resources/seleccionMail.js"


export const sendAltaEmailTo = async (usuario, docente) => {
    const info = await transporter.sendMail({
        from: 'Ciencia Conecta',
        to: usuario.email,
        subject: "Su cuenta de CienciaConecta ha sido activada",
        html: altaMailHtml(docente)
        });

    // Verificar si el correo se envió exitosamente
    if (info.accepted.length === 0) {
        // No se pudo enviar el correo
        throw new Error(`No se pudo enviar el correo a ${usuario.email}`);

    }
}

export const sendRecoveryEmailTo = async (token, usuario) => {
    
    const recoveryMail = recoveryMailHtml(token); 

    const info = await transporter.sendMail({
      from: 'Ciencia Conecta',
      to: usuario.email,
      subject: "Recuperación de contraseña",
      html: recoveryMail
    });

    // Verificar si el correo se envió exitosamente
    if (info.accepted.length === 0) {
        // No se pudo enviar el correo
        throw new Error(`No se pudo enviar el correo a ${usuario.email}`);

    }
}

export const sendConfirmationEmailTo = async (token, mail) => {
    const confirmationMail = confirmationMailHtml(token)

    const info = await transporter.sendMail({
      from: 'Ciencia Conecta',
      to: mail,
      subject: "Verifica tu cuenta de correo",
      html: confirmationMail
    })

    // Verificar si el correo se envió exitosamente
    if (info.accepted.length === 0) {
        // No se pudo enviar el correo
        throw new Error(`No se pudo enviar el correo a ${usuario.email}`);

    }
}

export const sendSeleccionEmailTo = async (usuario, docente) => {

    const info = await transporter.sendMail({
        from: 'Ciencia Conecta',
        to: usuario.email,
        subject: "Resultado de Postulación como Evaluador",
        html: seleccionMailHtml(docente)
        });
        
    // Verificar si el correo se envió exitosamente
    if (info.accepted.length === 0) {
        // No se pudo enviar el correo
        throw new Error(`No se pudo enviar el correo a ${usuario.email}`);
    }
}

