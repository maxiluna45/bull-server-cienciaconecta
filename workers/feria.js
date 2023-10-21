import { Feria, estadoFeria } from "../models/Feria.js";
import { Promocion, promocionA } from "../models/Promocion.js";
import { Proyecto, estado } from "../models/Proyecto.js";

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
        } else if (tipo == "finEvaluacionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EvaluacionFinalizada;
        } else if (tipo == "inicioExposicionRegional"){
            feria.estado = estadoFeria.instanciaRegional_EnExposicion;
        } else if (tipo == "finExposicionRegional"){
            feria.estado = estadoFeria.instanciaRegional_ExposicionFinalizada;
        } else if (tipo == "promovidosAProvincial"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaProvincial;
            await promoverProyectos_InstanciaProvincial(feria._id)
        } else if (tipo == "inicioExposicionProvincial"){
            feria.estado = estadoFeria.instanciaProvincial_EnExposicion;
        } else if (tipo == "finExposicionProvincial"){
            feria.estado = estadoFeria.instanciaProvincial_ExposicionFinalizada;
        } else if (tipo == "promovidosANacional"){
            feria.estado = estadoFeria.proyectosPromovidosA_instanciaNacional;
            await promoverProyectos_InstanciaNacional(feria._id)
        } else if (tipo == "finFeria"){
            feria.estado = estadoFeria.finalizada;
            await actualizarProyectos_Finalizado(feria._id)
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
};

const promoverProyectos_InstanciaProvincial = async (feria_id) => {
    const promociones =  await Promocion.find({feria: feria_id, promocionAInstancia: promocionA.instanciaProvincial})
    const proyectosPromocionados = promociones.map(promocion => promocion.proyectos).flat();

    await Proyecto.updateMany(
        { _id: { $in: proyectosPromocionados } },
        { $set: { estado: estado.promovidoProvincial } }
    );
};

const promoverProyectos_InstanciaNacional = async (feria_id) => {
    const promociones =  await Promocion.find({feria: feria_id, promocionAInstancia: promocionA.instanciaNacional})
    const proyectosPromocionados = promociones.map(promocion => promocion.proyectos).flat();

    await Proyecto.updateMany(
        { _id: { $in: proyectosPromocionados } },
        { $set: { estado: estado.promovidoNacional } }
    );
};

const actualizarProyectos_Finalizado = async (feria_id) => {
    await Proyecto.updateMany(
        { feria: feria_id},
        { $set: { estado: estado.finalizado } }
    );
};