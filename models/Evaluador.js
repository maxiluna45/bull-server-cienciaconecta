import { Schema, model } from "mongoose";

const EvaluadorSchema = new Schema({
  docente: {
    type: Boolean,
    required: [true, "Se debe indicar si es docente o investigador"], // True=Docente, False=Investigador
  },
  niveles: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: 'Nivel'
  },
  categorias: {
    type:  [Schema.Types.ObjectId],
    required: [true, "Se debe indicar al menos una categoría"],
    ref: 'Categoria'
  },
  sede: {
    type:  Schema.Types.ObjectId,
    required: [true, "Se debe indicar la sede en la cual se quiere evaluar"],
    ref: 'EstablecimientoEducativo'
  },
  CV: {
    type: String,
    required: false
  },
  id_carpeta_cv: {
    type: String,
    required: false
  },
  antecedentes: [{
    year: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      required: true,
      enum:['1', '2', '3'] // 1=Referente, 2=Evaluador, 3=Responsable
    },
  }],
  feria:{
    type:  Schema.Types.ObjectId,
    required: [true, "Se debe indicar la feria para la cual se ha postulado"],
    ref: 'Feria'
  },
  idDocente:{
    type:  Schema.Types.ObjectId,
    required: [true, "Se debe indicar el docente que se ha postulado"],
    ref: 'Docente'
  },
  fechaPostulacion:{
    type: Date,
    required: [true, "Se debe indicar la fecha de postulacion"],
    default: Date.now()
  },
  pendiente:{
    type: Boolean
  }
});


export const Evaluador = model('Evaluador', EvaluadorSchema);


