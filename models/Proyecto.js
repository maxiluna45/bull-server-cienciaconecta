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
  nameCarpetaCampo: {
    type: String,
  },
  nameRegistroPedagogicopdf: {
    type: String,
  },
  nameAutorizacionImagen: {
    type: String,
  },
  nameInformeTrabajo: {
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
  }

});

export const estado = {
  instanciaEscolar: '0',
  instanciaRegional: '1',
  enEvaluacionRegional: '2',
  evaluadoRegional: '3',
  promovidoNacional: '4',
  finalizado: '5',
  inactivo: '6',
};

export const nombreEstado = [
  "Instancia escolar",
  "Instancia regional",
  "En evaluación regional",
  "Promovido a instancia nacional",
  "Finalizado",
  "Inactivo",
]

export const Proyecto = model("Proyecto", ProyectoSchema);
