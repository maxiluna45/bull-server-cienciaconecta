import Worker from "bull";
import { altaMailHtml } from "../resources/altaMail.js"
import { transporter } from "../helpers/mailer.js";

export const emailWorker = async (job, done) => {

    try {
        const { usuario, docente } = job.data;

        await sendEmailTo(usuario, docente);

        done()

    } catch (error) {
        console.log("error ", error)
        done(error)
    }

};


const sendEmailTo = async (usuario, docente) => {

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