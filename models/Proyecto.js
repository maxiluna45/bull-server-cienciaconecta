import { Schema, model } from "mongoose";

const ProyectoSchema = new Schema({

  // ------------------ INSTANCIA ESCOLAR --------------------------------
  titulo: {
    type: String,
    required: [true, "El título del proyecto es requerido"],
    trim: true,
    unique: true,
  },
  descripcion: {
    type: String,
    required: [true, "La reseña del proyecto es requerido"],
  },
  nivel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Nivel",
  },
  categoria: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Categoria",
  },
  establecimientoEducativo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "EstablecimientoEducativo",
  },
  emailEscuela: {
    type: String,
    required: [true, "Se debe indicar un email de contacto de la escuela"],
  },
  idResponsable: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Docente",
  },
  fechaInscripcion: {
    type: Date,
    default: Date.now,
  },
  feria: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Feria",
  },
  estado: {
    type: String,
    default: '0',
    enum:['0', '1', '2', '3', '4', '5', '6']},

  // ------------------ INSTANCIA REGIONAL --------------------------------
  videoPresentacion: {
    type: String,
    trim: true,
  },
  registroPedagogico: {
    type: String,
    
  },
  carpetaCampo: {
    type: String,
    
  },
  informeTrabajo: {
    type: String,
  
  },
  sede:{
    type: Schema.Types.ObjectId,
    ref: 'EstablecimientoEducativo'
  },
  autorizacionImagen: {
    // type: Boolean,
    type: String,
  },
  id_carpeta_drive: {
    type: String,
  },
  grupoProyecto: [
    {
      nombre: {
        type: String,
      },
      apellido: {
        type: String,
      },
      dni: {
        type: String,
      },
    },
  ],
  evaluadoresRegionales: {
    type: [Schema.Types.ObjectId],
    required: false,
    ref: "Evaluador",
  },

  QR: {
    type: String,
  } 

});

export const estado = {
  instanciaEscolar: '0',
  instanciaRegional: '1',
  enEvaluacionRegional: '2',
  evaluadoRegional: '3',
  promovidoProvincial: '4',
  enEvaluacionProvincial: '5',
  evaluadoProvincial: '6',
  promovidoNacional: '7',
  finalizado: '8',
  inactivo: '9',

};

export const nombreEstado = {
  0: "Instancia escolar",
  1: "Instancia regional",
  2: "En evaluación regional",
  3: "Evaluado en instancia regional",
  4: "Promovido a instancia provincial",
  5: "En evaluación provincial",
  6: "Evaluado en instancia provincial",
  7: "Promovido a instancia nacional",
  8: "Finalizado",
  9: "Inactivo",
}

export const Proyecto = model("Proyecto", ProyectoSchema);