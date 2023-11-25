import { Schema, model } from "mongoose";

const NotificacionSchema = new Schema({
    id_usuario: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Usuario',
    },
    notificaciones: [{
        mensaje: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now()
        },
        estado: {
            type: String,
            required: true,
            enum: ['0', '1', '2'],
            default: '0',
        }
    }],
})


export const Notificacion = model('Notificacion', NotificacionSchema);

export const estadoNotificacion = {
    creada: '0',
    enviada: '1',
    leida: '2'
};
