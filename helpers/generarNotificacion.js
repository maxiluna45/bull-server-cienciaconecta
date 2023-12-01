import { Notificacion } from "../models/Notificacion.js"

export const generarNotificacion = async (usuario, mensaje) => {
    
    try {
        let notificacion = await Notificacion.findOne({id_usuario: usuario})
        if(notificacion){
            notificacion.notificaciones.push({
                mensaje: mensaje,
                timestamp: Date.now()
            })
        } else {
            notificacion = new Notificacion({
                id_usuario: usuario,
                notificaciones: [{
                    mensaje: mensaje,
                    timestamp: Date.now()
                }]
            })
        }
        notificacion.save()
        console.log(`Notificación enviada a ID ${usuario}: '${mensaje}'`)
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}


export const tipo_notificacion = {
    //
    promocion: (titulo, instancia) => `Tu proyecto '${titulo}' ha sido promovido a la instancia ${instancia}. ¡Felicidades!.`,
    //
    subir_documentos: (titulo) => `Tu proyecto '${titulo}' debe ser actualizado con los documentos correspondientes. Por favor, editá tu proyecto para actualizarlo.`,
    //
    no_promocion: (titulo, instancia) => `Tu proyecto '${titulo}' no ha sido promovido a la instancia ${instancia}. ¡Suerte para el próximo año!.`,
    //
    inicio_evaluacion: `La evaluación teórica de proyectos en la instancia Regional ha comenzado. Ya puedes comenzar a evaluar tus proyectos asignados.`,
    //
    inicio_exposicion: (instancia) =>`La evaluación de exposición de proyectos en la instancia ${instancia} ha comenzado. Ya puedes comenzar a evaluar tus proyectos asignados.`,
    //
    cinco_dias_evaluacion: (tipo, instancia) => `Sólo te quedan 5 días para completar la evaluación ${tipo} de tus proyectos en instancia ${instancia}.`,
    //
    un_dia_evaluacion: (tipo, instancia) => `Sólo te queda 1 día para completar la evaluación ${tipo} de tus proyectos en instancia ${instancia}.`,
    
    cinco_dias_asignacion: (cantidad) =>`Sólo te quedan 5 días para asignar evaluadores a los proyectos de tu sede. Te queda/n ${cantidad} proyecto/s por asignar.`,
   
    un_dia_asignacion: (cantidad) =>`Sólo te queda 1 día para asignar evaluadores a los proyectos de tu sede. Te queda/n ${cantidad} proyecto/s por asignar.`,
    //
    inicio_asignacion: "Ya podés comenzar a asignar evaluadores a los proyectos de tu sede.",
    //
    actualizacion_exitosa: `La actualización de Establecimientos Educativos ha finalizado exitosamente`,
    //
    creacion_exitosa: `Se han cargado todos los Establecimientos con éxito. No existían Establecimientos Educativos almacenados previamente.`,
    //
    actualizacion_fallida: `Ha fallado la actualización de Establecimientos Educativos`,
}