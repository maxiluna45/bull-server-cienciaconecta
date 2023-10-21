import { Schema, model } from "mongoose";

const PromocionSchema = new Schema({
    proyectos:[{
        type:  Schema.Types.ObjectId,
        required: [true, "Se debe indicar el proyecto que se va a promover a la siguiente instancia"],
        ref: 'Proyecto'
        
    }],

    feria:{
        type:  Schema.Types.ObjectId,
        required: [true, "Se debe indicar la feria para la cual se promoverán los proyectos"],
        ref: 'Feria'
    },

    promocionAInstancia:{
        type: String,
        required: true,
        enum: ["1", "2", "3"] 
        // 1 = Promoción a instancia regional 
        // 2 = Promoción a instancia provincial 
        // 3 = Promoción a instancia nacional
    },

    nivel: {
        type:  Schema.Types.ObjectId,
        required: [true, "Se debe indicar el nivel de los proyectos promovidos"],
        ref: 'Nivel'
    },

    sede: {
        type:  Schema.Types.ObjectId,
        required: false,
        ref: 'EstablecimientoEducativo'
    }
})

export const Promocion = model('Promocion', PromocionSchema);

export const promocionA = {
    instanciaRegional: "1",
    instanciaProvincial: "2",
    instanciaNacional: "3",
}