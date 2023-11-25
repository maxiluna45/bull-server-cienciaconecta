import { Schema, model } from "mongoose";

const ReferenteSchema = new Schema({
  sede: {
    type:  Schema.Types.ObjectId,
    required: [true, "Se debe indicar la sede en la cual se quiere evaluar"],
    ref: 'EstablecimientoEducativo'
  },
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
  // evaluadoresAsignados:{
  //   type: [Schema.Types.ObjectId],
  //   required: false,
  //   ref: 'Evaluador'
  // }
});


export const Referente = model('Referente', ReferenteSchema);
