import { Schema, model } from "mongoose";

const DocenteSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  apellido: {
    type: String,
    required: [true, "El apellido es obligatorio"],
  },
  cuil: {
    type: String,
    required: [true, "El CUIL es obligatorio"],
  },
  telefono: {
    type: String,
    required: [true, "El número de teléfono es obligatorio"],
  },
  cargo: {
    type: String,
    required: [true, "El cargo del docente en la institución es obligatorio"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  }
});


export const Docente = model('Docente', DocenteSchema);
