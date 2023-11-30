import { Evaluacion, estadoEvaluacion } from "../models/Evaluacion.js";
import { EvaluacionExposicion, estadoEvaluacionExposicion } from "../models/EvaluacionExposicion.js";
import { EvaluacionExposicionProvincial, estadoEvaluacionExposicionProvincial } from "../models/EvaluacionExposicion_Provincial.js";
import { Proyecto, estado } from "../models/Proyecto.js";

export const cancelarEvaluacionRegional = async (feria_id, proyecto_id) => {
    try {
        
        const proyecto = await Proyecto.findById(proyecto_id);

        const evaluacion_pendiente = await Evaluacion.findOne({proyectoId: proyecto_id, estado: estadoEvaluacionExposicion.enEvaluacion})
        if(!evaluacion_pendiente){
            return;
        }

        if(evaluacion_pendiente?.evaluacion == null){
            evaluacion_pendiente.deleteOne()
            proyecto.estado = estado.instanciaRegional;
            proyecto.save();
        } else {
            evaluacion_pendiente.evaluando = null;
            evaluacion_pendiente.estado = estadoEvaluacion.abierta;

            evaluacion_pendiente.save();
        }

    } catch (error) {
        console.log(error)
    }

}



export const cancelarExposicionRegional = async (feria_id, proyecto_id) => {
    try {
        
        const proyecto = await Proyecto.findById(proyecto_id);

        const evaluacion_pendiente = await EvaluacionExposicion.findOne({proyectoId: proyecto_id, estado: estadoEvaluacionExposicionProvincial.enEvaluacion})
        if(!evaluacion_pendiente){
            return;
        }

        if(evaluacion_pendiente?.evaluacion == null){
            evaluacion_pendiente.deleteOne()
            proyecto.estado = estado.instanciaRegional;
            proyecto.save();
        } else {
            evaluacion_pendiente.evaluando = null;
            evaluacion_pendiente.estado = estadoEvaluacion.abierta;

            evaluacion_pendiente.save();
        }

    } catch (error) {
        console.log(error)
    }

}


export const cancelarExposicionProvincial = async (feria_id, proyecto_id) => {
    try {
        
        const proyecto = await Proyecto.findById(proyecto_id);

        const evaluacion_pendiente = await EvaluacionExposicionProvincial.findOne({proyectoId: proyecto_id, estado: estadoEvaluacionExposicionProvincial.enEvaluacion})
        if(!evaluacion_pendiente){
            return;
        }

        if(evaluacion_pendiente?.evaluacion == null){
            evaluacion_pendiente.deleteOne()
            proyecto.estado = estado.instanciaRegional;
            proyecto.save();
        } else {
            evaluacion_pendiente.evaluando = null;
            evaluacion_pendiente.estado = estadoEvaluacion.abierta;

            evaluacion_pendiente.save();
        }

    } catch (error) {
        console.log(error)
    }

}