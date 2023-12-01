import { Schema, model } from "mongoose";

const EstablecimientoEducativoSchema = new Schema({
    nombre:{
        type: String,
        required:  [true, "El nombre del establecimiento educativo es requerido"],
    },
    cue: {
        type: String,
        required: [true, "El CUE del establecimiento educativo es requerido"],
    },
    provincia: {
        type: String,
        required: [true, "La provincia del establecimiento educativo es requerido"],
    },
    departamento: {
        type: String,
        required: [true, "El departamento del establecimiento educativo es requerido"],
    },
    localidad: {
        type: String,
        required: [true, "La localidad del establecimiento educativo es requerido"],
    },
    domicilio: {
        type: String,
        required: [true, "El domicilio del establecimiento educativo es requerido"],
    },
    CP: {
        type: String,
        required: false,
    },
    telefono: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    niveles:{
        inicial:{
            type: Boolean,
            required:false,
        },
        primario:{
            type: Boolean,
            required:false,
        },
        secundario:{
            type: Boolean,
            required:false,
        },
        terciario:{
            type: Boolean,
            required:false,
        }
    },
    ferias: {
        type: [Schema.Types.ObjectId],
        default: [],
        ref: 'Feria',
    },
    activo: {
        type: Boolean,
        required: false,
        default: true,
    }
})


export const EstablecimientoEducativo = model('EstablecimientoEducativo', EstablecimientoEducativoSchema);
