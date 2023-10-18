import { Feria, estadoFeria } from "../models/Feria.js";

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
        } else if (tipo == "inicioEvaluacionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EnEvaluacion;
        } else if (tipo == "finEvaluacionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EvaluacionFinalizada;
        } else if (tipo == "inicioExposicionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EnExposicion;
        } else if (tipo == "finExposicionRegional"){
            feria.estado = estadoFeria.instanciaRegional_ExposicionFinalizada;
        } else if (tipo == "promovidosAProvincial"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaProvincial;
        } else if (tipo == "inicioExposicionProvincial"){
            feria.estado = estadoFeria.instanciaProvincial_EnExposicion;
        } else if (tipo == "finExposicionProvincial"){
            feria.estado = estadoFeria.instanciaProvincial_ExposicionFinalizada;
        } else if (tipo == "promovidosANacional"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaNacional;
        } else if (tipo == "finFeria"){
            feria.estado = estadoFeria.finalizada;
        } 

        feria.save()

    } catch (error) {
        console.log(error)
    }
}