import {Schema , model} from 'mongoose';

const feriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre es obligatorio'],
    },
    descripcion: {
        type: String,
        required: [true , 'La descripción es obligatoria'],
    },
    fechaInicioFeria: {
        type: Date,
        required: [true , 'La fecha de inicio de Feria es obligatoria'],
        default: Date.now(),
    },
    fechaFinFeria: {
        type: Date,
        required: [true , 'La fecha de fin de Feria es obligatoria'],
    },

    instancias: {
        instanciaEscolar: {
            fechaInicioInstancia: {
                type: Date,
                required: [true , 'La fecha de inicio de instancia escolar es obligatoria'],
            },
            fechaFinInstancia: {
                type: Date,
                required: [true , 'La fecha de fin de instancia escolar es obligatoria'],
            },
        },
        instanciaRegional: {
            fechaInicioEvaluacionTeorica: {
                type: Date,
                required: [true , 'La fecha de inicio de evaluación teórica de instancia regional es obligatoria'],
            },
            fechaFinEvaluacionTeorica: {
                type: Date,
                required: [true , 'La fecha de fin de evaluación teórica de instancia regional es obligatoria'],
            },
            fechaInicioEvaluacionPresencial: {
                type: Date,
                required: [true , 'La fecha de inicio de evaluación presencial de instancia regional es obligatoria'],
            },
            fechaFinEvaluacionPresencial: {
                type: Date,
                required: [true , 'La fecha de fin de evaluación presencial de instancia regional es obligatoria'],
            },
            fechaPromocionAProvincial: {
                type: Date,
                required: [true , 'La fecha de promoción de proyectos a instancia provincial es obligatoria'],
            },
            cupos: {
                porNivel: [{
                    nivel: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: 'Nivel',
                    },
                    cantidad: {
                        type: Number,
                        required: true,
                    }
                }],
                porSede: [{
                    sede: {
                        type: Schema.Types.ObjectId,
                        required: true,
                        ref: 'EstablecimientoEducativo',
                    },
                    cantidad: {
                        type: Number,
                        required: true,
                    }
                }]

            },
            sedes: {
                type: [Schema.Types.ObjectId],
                required: [true , 'Se requiere al menos una sede para instancia regional'],
                ref: 'EstablecimientoEducativo',
            },
        },
        instanciaProvincial: {
            fechaInicioEvaluacionPresencial: {
                type: Date,
                required: [true , 'La fecha de inicio de evaluación presencial de instancia provincial es obligatoria'],
            },
            fechaFinEvaluacionPresencial: {
                type: Date,
                required: [true , 'La fecha de fin de evaluación presencial de instancia provincial es obligatoria'],
            },
            fechaPromocionANacional: {
                type: Date,
                required: [true , 'La fecha de promoción de proyectos a instancia nacional es obligatoria'],
            },
            cupos: [{
                nivel: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Nivel',
                },
                cantidad: {
                    type: Number,
                    required: true,
                }
            }],
        },
    
    },

    fechaInicioPostulacionEvaluadores: {
        type: Date,
        required: false,
    },
    fechaFinPostulacionEvaluadores: {
        type: Date,
        required: false,
    },

    fechaInicioAsignacionProyectos: {
        type: Date,
        required: false,
    },
    fechaFinAsignacionProyectos: {
        type: Date,
        required: false,
    },
    criteriosEvaluacion: [{
        nombreRubrica: {
            type: String,
            required: true,
        },
        criterios: [{
            nombre: {
                type: String,
                required: true,
            },
            opciones: [{
                nombre: {
                    type: String,
                    required: true,
                },
                puntaje: {
                    type: Number,
                    required: true, // Puntaje de 0 a 100
                }
                
            }],
            ponderacion: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
        }],
        ponderacion: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        exposicion: {
            type: Boolean,      // True = Rubrica sólo para exposicion
            required: true,     // False = Rubrica sólo para evaluación teórica
        }
    }],

    estado: {
        type: String,
        default: "1",
        enum:['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        required: true
    },

    usuarioResponsable: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Usuario",
    }
})


export const Feria = model('Feria', feriaSchema);

export const estadoFeria = {
    creada: '0',
    iniciada: '1',
    instanciaEscolar: '2',
    instanciaEscolar_Finalizada: '3',
    instanciaRegional_EnEvaluacion: '4',
    instanciaRegional_EvaluacionFinalizada: '5',
    instanciaRegional_EnExposicion: '6',
    instanciaRegional_ExposicionFinalizada: '7',
    proyectosPromovidosA_instanciaProvincial: '8',
    instanciaProvincial_EnExposicion: '9',
    instanciaProvincial_ExposicionFinalizada: '10',
    proyectosPromovidosA_instanciaNacional: '11',
    finalizada: '12',
};

export const siguienteFecha = {
    creada: 'fechaInicioFeria',
    iniciada: 'instancias.instanciaEscolar.fechaInicioInstancia',
    instanciaEscolar: 'instancias.instanciaEscolar.fechaFinInstancia',
    instanciaEscolar_Finalizada: 'instancias.instanciaRegional.fechaInicioEvaluacionTeorica',
    instanciaRegional_EnEvaluacion: 'instancias.instanciaRegional.fechaFinEvaluacionTeorica',
    instanciaRegional_EvaluacionFinalizada: 'instancias.instanciaRegional.fechaInicioEvaluacionPresencial',
    instanciaRegional_EnExposicion: 'instancias.instanciaRegional.fechaFinEvaluacionPresencial',
    instanciaRegional_ExposicionFinalizada: 'instancias.instanciaRegional.fechaPromocionAProvincial',
    proyectosPromovidosA_instanciaProvincial: 'instancias.instanciaProvincial.fechaInicioEvaluacionPresencial',
    instanciaProvincial_EnExposicion: 'instancias.instanciaProvincial.fechaFinEvaluacionPresencial',
    instanciaProvincial_ExposicionFinalizada: 'instancias.instanciaRegional.fechaPromocionANacional',
    proyectosPromovidosA_instanciaNacional: 'fechaFinFeria',
    finalizada: 'fechaFinFeria',
};


export const fechasFeria = {
    fechaInicio: "fechaInicioFeria",
    fechaFin: "fechaFinFeria",
    fechaInicioEscolar: "instancias.instanciaEscolar.fechaInicioInstancia",
    fechaFinEscolar: "instancias.instanciaEscolar.fechaFinInstancia",
    fechaInicioEvaluacionRegional: "instancias.instanciaRegional.fechaInicioEvaluacionTeorica",
    fechaFinEvaluacionRegional: "instancias.instanciaRegional.fechaFinEvaluacionTeorica",
    fechaInicioExposicionRegional: "instancias.instanciaRegional.fechaInicioEvaluacionPresencial",
    fechaFinExposicionRegional: "instancias.instanciaRegional.fechaFinEvaluacionPresencial",
    fechaPromocionAProvincial: "instancias.instanciaRegional.fechaPromocionAProvincial",
    fechaInicioExposicionProvincial: "instancias.instanciaProvincial.fechaInicioEvaluacionPresencial",
    fechaFinExposicionProvincial: "instancias.instanciaProvincial.fechaFinEvaluacionPresencial",
    fechaPromocionANacional: "instancias.instanciaRegional.fechaPromocionANacional",
    fechaInicioPostulacion: "fechaInicioPostulacionEvaluadores",
    fechaFinPostulacion: "fechaFinPostulacionEvaluadores",
    fechaInicioAsignacion: "fechaInicioAsignacionProyectos",
    fechaFinAsignacion: "fechaFinAsignacionProyectos",
}