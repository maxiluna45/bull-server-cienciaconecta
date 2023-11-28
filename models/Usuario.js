import { Schema, model } from "mongoose";
import { roles } from "../helpers/roles.js";

const UsuarioSchema = new Schema({
  cuil: {
    type: String,
    required: [true, "El CUIL es obligatorio"],
    unique: true,
    index: { unique: true },
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  estado: {
    type: String, // 0=inactivo, 1=activo, 2=pendiente
    default: '2',
    required: true,
    enum:['0','1','2']
  },
  roles: {
    type: [String],
    default: [roles.docente],
  },
  tokenConfirm: {
    type: String,
    default: null,
  },
  cuentaConfirmada: {
    type: Boolean,
    default: false,
  },
  tokenRecuperacion: {
    type: String,
    default: null,
  },
});

export const Usuario = model('Usuario', UsuarioSchema);