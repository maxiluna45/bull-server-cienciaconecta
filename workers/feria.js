import { generarNotificacion, tipo_notificacion } from "../helpers/generarNotificacion.js";
import { roles } from "../helpers/roles.js";
import { Docente } from "../models/Docente.js";
import { Evaluacion, estadoEvaluacion } from "../models/Evaluacion.js";
import { EvaluacionExposicion, estadoEvaluacionExposicion } from "../models/EvaluacionExposicion.js";
import { EvaluacionExposicionProvincial, estadoEvaluacionExposicionProvincial } from "../models/EvaluacionExposicion_Provincial.js";
import { Evaluador } from "../models/Evaluador.js";
import { Feria, estadoFeria } from "../models/Feria.js";
import { Promocion, promocionA } from "../models/Promocion.js";
import { Proyecto, estado } from "../models/Proyecto.js";
import { Referente } from "../models/Referente.js";
import { Usuario } from "../models/Usuario.js";
import { email } from "../queues.js";

export const modificarEstadosFeria = async (feria_id, tipo) => {
    try {
        // Obtener la Feria por su ID
        const feria = await Feria.findById(feria_id);

        if(tipo == "inicioFeria"){
            feria.estado = estadoFeria.iniciada;
        } else if (tipo == "inicioInstanciaEscolar"){
            feria.estado = estadoFeria.instanciaEscolar;
        } else if (tipo == "finInstanciaEscolar"){
            feria.estado = estadoFeria.instanciaEscolar_Finalizada;
            await actualizarProyectos_InstanciaRegional(feria._id)
        } else if (tipo == "inicioEvaluacionRegional"){
            
            feria.estado = estadoFeria.instanciaRegional_EnEvaluacion;
            await proyectosSinDocumentos(feria)

            const proyectos_inicio_evaluacion_regional = await Proyecto.find({feria: feria_id, estado: estado.instanciaRegional})
            let evaluadores_enviado = []; 
            for(const proyecto of proyectos_inicio_evaluacion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    if(!evaluadores_enviado.includes(docente.usuario.toString())){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.inicio_evaluacion)
                        evaluadores_enviado.push(docente.usuario.toString())
                    }
                }

            }

        } else if (tipo == "finEvaluacionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EvaluacionFinalizada;
            await procesarProyectosNoEvaluados_EvaluacionRegional(feria)

        } else if (tipo == "inicioExposicionRegional"){

            feria.estado = estadoFeria.instanciaRegional_EnExposicion;

            const proyectos_inicio_exposicion_regional = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionRegional}) 
            let evaluadores_enviado = [];
            for(const proyecto of proyectos_inicio_exposicion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    if(!evaluadores_enviado.includes(docente.usuario.toString())){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.inicio_exposicion("Regional"))
                        evaluadores_enviado.push(docente.usuario.toString())
                    }
                }
            }

        } else if (tipo == "finExposicionRegional"){
            feria.estado = estadoFeria.instanciaRegional_ExposicionFinalizada;
            await procesarProyectosNoEvaluados_ExposicionRegional(feria)

        } else if (tipo == "promovidosAProvincial"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaProvincial;
            await promoverProyectos_InstanciaProvincial(feria._id)
        } else if (tipo == "inicioExposicionProvincial"){

            feria.estado = estadoFeria.instanciaProvincial_EnExposicion;

            const proyectos_inicio_exposicion_provincial = await Proyecto.find({feria: feria_id, estado: estado.promovidoProvincial})
            let evaluadores_enviado = [];
            for(const proyecto of proyectos_inicio_exposicion_provincial){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    if(!evaluadores_enviado.includes(docente.usuario.toString())){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.inicio_exposicion("Provincial"))
                        evaluadores_enviado.push(docente.usuario.toString())
                    }
                }
            }

        } else if (tipo == "finExposicionProvincial"){
            feria.estado = estadoFeria.instanciaProvincial_ExposicionFinalizada;
            await procesarProyectosNoEvaluados_ExposicionProvincial(feria)

        } else if (tipo == "promovidosANacional"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaNacional;
            await promoverProyectos_InstanciaNacional(feria._id)
        } else if (tipo == "finFeria"){
            feria.estado = estadoFeria.finalizada;
            await actualizarProyectos_Finalizado(feria._id)
            await quitarRoles()
        } else if (tipo == "inicioAsignacion") {

            const referentes = await Referente.find({feria: feria._id})
            for (const referente of referentes) {
                const docente = await Docente.findById(referente.idDocente)
                await generarNotificacion(docente.usuario.toString(), tipo_notificacion.inicio_asignacion)
            }

        } else if (tipo == "cinco_dias_finAsignacion") {

            const referentes = await Referente.find({feria: feria._id})
            for (const referente of referentes) {
                const docente = await Docente.findById(referente.idDocente)
                const proyectosNoAsignados = await Proyecto.countDocuments({
                    feria: feria._id,
                    sede: referente.sede,
                    $or: [
                        { evaluadoresRegionales: { $exists: false } },
                        { evaluadoresRegionales: { $size: 0 } }
                    ]
                });
                if(proyectosNoAsignados != 0) {
                    await generarNotificacion(docente.usuario.toString(), tipo_notificacion.cinco_dias_asignacion(proyectosNoAsignados.toString()))
                }
            }

        } else if (tipo == "un_dia_finAsignacion") {

            const referentes = await Referente.find({feria: feria._id})
            for (const referente of referentes) {
                const docente = await Docente.findById(referente.idDocente)
                const proyectosNoAsignados = await Proyecto.countDocuments({
                    feria: feria._id,
                    sede: referente.sede,
                    $or: [
                        { evaluadoresRegionales: { $exists: false } },
                        { evaluadoresRegionales: { $size: 0 } }
                    ]
                });
                if(proyectosNoAsignados != 0) {
                    await generarNotificacion(docente.usuario.toString(), tipo_notificacion.un_dia_asignacion(proyectosNoAsignados.toString()))
                }
            }
        } else if (tipo == "cinco_dias_finEvaluacionRegional"){

            const proyectos_fin_evaluacion_regional = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionRegional}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_evaluacion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await Evaluacion.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacion.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.cinco_dias_evaluacion("teórica", "Regional"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 
                        
        } else if (tipo == "un_dia_finEvaluacionRegional"){

            const proyectos_fin_evaluacion_regional = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionRegional}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_evaluacion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await Evaluacion.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacion.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.un_dia_evaluacion("teórica", "Regional"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 
            
        } else if (tipo == "cinco_dias_finExposicionRegional"){

            const proyectos_fin_exposicion_regional = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionRegional}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_exposicion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await EvaluacionExposicion.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacionExposicion.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.cinco_dias_evaluacion("de exposición", "Regional"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 
            
        } else if (tipo == "un_dia_finExposicionRegional"){

            const proyectos_fin_exposicion_regional = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionRegional}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_exposicion_regional){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await EvaluacionExposicion.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacionExposicion.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.un_dia_evaluacion("de exposición", "Regional"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 
            
            
        } else if (tipo == "cinco_dias_finExposicionProvincial"){

            const proyectos_fin_exposicion_provincial = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionProvincial}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_exposicion_provincial){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await EvaluacionExposicionProvincial.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacionExposicionProvincial.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.cinco_dias_evaluacion("de exposición", "Provincial"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 
            
            
        } else if (tipo == "un_dia_finExposicionProvincial"){
            
            const proyectos_fin_exposicion_provincial = await Proyecto.find({feria: feria_id, estado: estado.enEvaluacionProvincial}) 
            let evaluadores_enviado = []
            for(const proyecto of proyectos_fin_exposicion_provincial){
                for(const ev of proyecto.evaluadoresRegionales){
                    const evaluador = await Evaluador.findById(ev)
                    const docente = await Docente.findById(evaluador.idDocente)
                    const evaluacion = await EvaluacionExposicionProvincial.find({proyectoId: proyecto.id.toString()})
                    if((evaluacion.estado != estadoEvaluacionExposicionProvincial.cerrada) && (!evaluadores_enviado.includes(docente.usuario.toString()))){
                        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.un_dia_evaluacion("de exposición", "Provincial"))
                        evaluadores_enviado.push(docente.usuario.toString());
                    }
                }
            } 

        }

        feria.save()

    } catch (error) {
        console.log(error)
    }
}



const actualizarProyectos_InstanciaRegional = async (feria_id) => {
    await Proyecto.updateMany(
        { feria: feria_id, estado: estado.instanciaEscolar },
        { $set: { estado: estado.instanciaRegional } }
    );

    const proyectosActualizarDocumentos = await Proyecto.find({feria: feria_id, estado: estado.instanciaRegional})
    for(const proyecto of proyectosActualizarDocumentos){
        const docente = await Docente.findById(proyecto.idResponsable)
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.promocion(proyecto.titulo, "Regional"))
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.subir_documentos(proyecto.titulo))
    }

};

const promoverProyectos_InstanciaProvincial = async (feria_id) => {
    const promociones =  await Promocion.find({feria: feria_id, promocionAInstancia: promocionA.instanciaProvincial})
    const proyectosPromocionados = promociones.map(promocion => promocion.proyectos).flat();

    await Proyecto.updateMany(
        { _id: { $in: proyectosPromocionados } },
        { $set: { estado: estado.promovidoProvincial } }
    );


    for(const proyecto_id of proyectosPromocionados){
        const proyecto = await Proyecto.findById(proyecto_id.toString())
        const docente = await Docente.findById(proyecto.idResponsable.toString())
        const usuario = await Usuario.findById(docente.usuario.toString())
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.promocion(proyecto.titulo, "Provincial"))
        email.add("email:promocionProyecto", { 
            mail: usuario.email,
            proyecto: proyecto.titulo,
            id_proyecto: proyecto._id,
            instancia: "Provincial",
        })
    }

    const proyectosNoPromocionados = await Proyecto.find({feria: feria_id, estado: estado.evaluadoRegional})
    for(const proyecto of proyectosNoPromocionados){
        const docente = await Docente.findById(proyecto.idResponsable)
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.no_promocion(proyecto.titulo, "Provincial"))
    }

    await Proyecto.updateMany(
        { _id: { $nin: proyectosPromocionados }, feria: feria_id, estado: estado.evaluadoRegional },
        { $set: { estado: estado.finalizado } }
    );
};



const promoverProyectos_InstanciaNacional = async (feria_id) => {
    const promociones =  await Promocion.find({feria: feria_id, promocionAInstancia: promocionA.instanciaNacional})
    const proyectosPromocionados = promociones.map(promocion => promocion.proyectos).flat();

    await Proyecto.updateMany(
        { _id: { $in: proyectosPromocionados } },
        { $set: { estado: estado.promovidoNacional } }
    );

    for(const proyecto_id of proyectosPromocionados){
        const proyecto = await Proyecto.findById(proyecto_id.toString())
        const docente = await Docente.findById(proyecto.idResponsable)
        const usuario = await Usuario.findById(docente.usuario.toString())
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.promocion(proyecto.titulo, "Nacional"))
        email.add("email:promocionProyecto", { 
            mail: usuario.email,
            proyecto: proyecto.titulo,
            id_proyecto: proyecto._id,
            instancia: "Nacional",
        })
    }

    const proyectosNoPromocionados = await Proyecto.find({feria: feria_id, estado: estado.evaluadoProvincial})
    for(const proyecto of proyectosNoPromocionados){
        const docente = await Docente.findById(proyecto.idResponsable)
        await generarNotificacion(docente.usuario.toString(), tipo_notificacion.no_promocion(proyecto.titulo, "Nacional"))
    }

    await Proyecto.updateMany(
        { _id: { $nin: proyectosPromocionados }, feria: feria_id, estado: estado.evaluadoProvincial },
        { $set: { estado: estado.finalizado } }
    );
};


const actualizarProyectos_Finalizado = async (feria_id) => {
    await Proyecto.updateMany(
        { feria: feria_id},
        { $set: { estado: estado.finalizado } }
    );
};


const quitarRoles = async () => {
    try {
      const rolesAQuitar = [roles.responsableProyecto, roles.evaluador, roles.refEvaluador];
  
      // Actualiza todos los usuarios eliminando los roles especificados
      await Usuario.updateMany(
        { roles: { $in: rolesAQuitar } },
        { $pull: { roles: { $in: rolesAQuitar } } }
      );
  
      console.log('Roles quitados exitosamente.');
    } catch (error) {
      console.error('Error al quitar roles:', error);
    }
  };



export const procesarProyectosNoEvaluados_EvaluacionRegional = async (feria) => {
    
    try {
        const proyectosNoEvaluados = await Proyecto.find({feria: feria._id, estado: {$in: [estado.enEvaluacionRegional, estado.instanciaRegional]} })
        
        await Promise.all(proyectosNoEvaluados.map(async (proyecto) => {
            const evaluacion = await Evaluacion.findOne({proyectoId: proyecto._id})

            if(!evaluacion) {
                const evaluacion_vacia = new Evaluacion({
                    evaluacion: null,
                    evaluadorId: [],
                    proyectoId: proyecto.id,
                    puntajeTeorico: 0,
                    listo: [],
                    estado: estadoEvaluacion.cerrada,
                    ultimaEvaluacion: null,
                    evaluando: null,
                })
                await evaluacion_vacia.save()

            } else if (evaluacion.estado == estadoEvaluacion.abierta || evaluacion.estado == estadoEvaluacion.enEvaluacion){
                evaluacion.estado = estadoEvaluacion.cerrada
                evaluacion.evaluando = null;
                if(evaluacion.puntajeTeorico == -1){
                    evaluacion.puntajeTeorico = 0;
                }
                await evaluacion.save()
            } 

            if(proyecto.estado != estado.enEvaluacionRegional){
                proyecto.estado = estado.enEvaluacionRegional;
                await proyecto.save()
            }


        }));

    } catch (error) {
        console.error('Error procesar los proyectos:', error);
    }
}


export const procesarProyectosNoEvaluados_ExposicionRegional = async (feria) => {
    
    try {
        const proyectosNoEvaluados = await Proyecto.find({feria: feria._id, estado: {$in: [estado.enEvaluacionRegional]} })
        
        await Promise.all(proyectosNoEvaluados.map(async (proyecto) => {
            const exposicion = await EvaluacionExposicion.findOne({proyectoId: proyecto._id})
            const evaluacion = await Evaluacion.findOne({proyectoId: proyecto._id})

            if(!exposicion) {
                const evaluacion_vacia = new EvaluacionExposicion({
                    evaluacion: null,
                    evaluadorId: [],
                    proyectoId: proyecto.id,
                    puntajeExposicion: 0,
                    puntajeFinal: evaluacion.puntajeTeorico,
                    listo: [],
                    estado: estadoEvaluacionExposicion.cerrada,
                    ultimaEvaluacion: null,
                    evaluando: null
                  })
                await evaluacion_vacia.save()

            } else if (exposicion.estado == estadoEvaluacionExposicion.abierta || exposicion.estado == estadoEvaluacionExposicion.enEvaluacion){
                exposicion.estado = estadoEvaluacionExposicion.cerrada
                exposicion.evaluando = null;
                if(exposicion.puntajeFinal == -1){
                    exposicion.puntajeFinal = 0;
                }
                if(exposicion.puntajeExposicion == -1){
                    exposicion.puntajeExposicion = 0;
                }
                await exposicion.save()
            } 

            proyecto.estado = estado.evaluadoRegional;
            proyecto.save()


        }));

    } catch (error) {
        console.error('Error procesar los proyectos:', error);
    }
}


export const procesarProyectosNoEvaluados_ExposicionProvincial = async (feria) => {
    
    try {
        const proyectosNoEvaluados = await Proyecto.find({feria: feria._id, estado: {$in: [estado.enEvaluacionProvincial, estado.promovidoProvincial]} })
        
        await Promise.all(proyectosNoEvaluados.map(async (proyecto) => {
            const exposicion = await EvaluacionExposicionProvincial.findOne({proyectoId: proyecto._id})

            if(!exposicion) {
                const evaluacion_vacia = new EvaluacionExposicionProvincial({
                    evaluacion: null,
                    evaluadorId: [],
                    proyectoId: proyecto.id,
                    puntajeExposicion: 0,
                    listo: [],
                    estado: estadoEvaluacionExposicionProvincial.cerrada,
                    ultimaEvaluacion: null,
                    evaluando: null
                  })
                await evaluacion_vacia.save()

            } else if (exposicion.estado == estadoEvaluacionExposicionProvincial.abierta || exposicion.estado == estadoEvaluacionExposicionProvincial.enEvaluacion){
                exposicion.estado = estadoEvaluacionExposicionProvincial.cerrada
                exposicion.evaluando = null;
                if(exposicion.puntajeExposicion == -1){
                    exposicion.puntajeExposicion = 0;
                }
                await exposicion.save()
            } 

            proyecto.estado = estado.evaluadoProvincial;
            proyecto.save()


        }));

    } catch (error) {
        console.error('Error procesar los proyectos:', error);
    }
}


const proyectosSinDocumentos = async (feria) => {
    try {
        const proyectos = await Proyecto.find({feria: feria._id, estado: estado.instanciaRegional})
        await Promise.all(proyectos.map(async (proyecto) => {
            if (proyecto.videoPresentacion === null || proyecto.videoPresentacion === undefined ||
                proyecto.registroPedagogico === null || proyecto.registroPedagogico === undefined ||
                proyecto.carpetaCampo === null || proyecto.carpetaCampo === undefined ||
                proyecto.informeTrabajo === null || proyecto.informeTrabajo === undefined ||
                proyecto.autorizacionImagen === null || proyecto.autorizacionImagen === undefined){

                    proyecto.estado = estado.finalizado;
                    proyecto.save()

                    const docente = await Docente.findById({_id: proyecto.idResponsable.toString()})
                    await generarNotificacion(docente.usuario.toString(), tipo_notificacion.documentos_no_cargados(proyecto.titulo))
            }
        }));

    } catch (error) {
        console.error('Error procesar los proyectos:', error);
    }
}