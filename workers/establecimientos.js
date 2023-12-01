import { EstablecimientoEducativo } from "../models/EstablecimientoEducativo.js";
import xlsx  from 'xlsx';

export const actualizarEstablecimientosEducativos = async (files, job) => {
  try {


    const count = await EstablecimientoEducativo.estimatedDocumentCount().maxTimeMS(20000);
    if(count == 0){
        await crearEstablecimientos(files, job)
        return false;
    } else {

        await actualizarEstablecimientos(files, job)
        return true;
    }
    
  } catch (error) {
    console.log(error)
  }
}


// const actualizarEstablecimientos = async (files, job) => {

//     try {
//         const archivo = files?.establecimientosEducativos;
//         if (!archivo) {
//             console.error("Debe ingresar un archivo con formato .xls con el nombre 'establecimientosEducativos'");
//             return;
//         }

//         const workbook = xlsx.read(archivo.filepath, { type: 'file' });
//         const worksheet = workbook.Sheets['padron'];

//         // Convertir el contenido del archivo Excel a un arreglo de objetos
//         const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 14 });

//         // Filtrar las filas cuya provincia es "Córdoba"
//         const dataCordoba = data.filter(row => row[0] === 'Córdoba');
//         let totalRows = dataCordoba.length;
//         let processedRows = 0;

//         // Obtener todos los establecimientos de Córdoba en la base de datos
//         const establecimientosDB = await EstablecimientoEducativo.find({ provincia: 'Córdoba' });

//         let actualizados = 0;
//         let creados = 0;
//         let eliminados = 0;
//         // Recorrer los establecimientos del nuevo padrón.
//         for (const row of dataCordoba) {
//             const cueFromExcel = row[7];
//             const cue = cueFromExcel.substr(2); // Quitar los dos primeros números

//             // Buscar el establecimiento en la base de datos por CUE
//             const establecimientoDB = establecimientosDB.find(est => est.cue === cue);

//             let actualizo = false;
//             if (establecimientoDB) {
//                 // Si el establecimiento existe en la base de datos...
//                 // Comparar y actualizar los campos si son diferentes
//                 if (establecimientoDB.nombre !== row[8]) {
//                     establecimientoDB.nombre = row[8];
//                     actualizo = true;
//                 }

//                 if (establecimientoDB.provincia !== row[0]) {
//                     establecimientoDB.provincia = row[0];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.departamento !== row[3]) {
//                     establecimientoDB.departamento = row[3];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.localidad !== row[5]) {
//                     establecimientoDB.localidad = row[5];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.domicilio !== row[9]) {
//                     establecimientoDB.domicilio = row[9];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.CP !== row[10]) {
//                     establecimientoDB.CP = row[10];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.telefono !== row[11]) {
//                     establecimientoDB.telefono = row[11];
//                     actualizo = true;
//                 }
            
//                 if (establecimientoDB.email !== row[12]) {
//                     establecimientoDB.email = row[12];
//                     actualizo = true;
//                 }            

//                 if(actualizo){
//                     actualizados += 1;
//                 }

//                 // Marcar como activo
//                 establecimientoDB.activo = true;

//                 // Guardar el establecimiento actualizado en la base de datos
//                 await establecimientoDB.save();
                
//             } else {
//                 // El establecimiento no existe en la base de datos, crearlo
//                 const nuevoEstablecimiento = {
//                     nombre: row[8],
//                     cue,
//                     provincia: row[0],
//                     departamento: row[3],
//                     localidad: row[5],
//                     domicilio: row[9],
//                     CP: row[10],
//                     telefono: row[11],
//                     email: row[12],
//                     activo: true,
//                 };

//                 await EstablecimientoEducativo.create(nuevoEstablecimiento);
//                 creados += 1
//             }

//             processedRows += 1;

//             // Informar sobre el progreso
//             const progress = Math.round((processedRows / totalRows) * 100);
//             job.progress(progress);
//         }

//         // Marcar como inactivos aquellos establecimientos que no están en el nuevo Excel
//         for (const establecimientoDB of establecimientosDB) {
//             if (!dataCordoba.some(row => row[7].substr(2) === establecimientoDB.cue)) {
//                 establecimientoDB.activo = false;
//                 await establecimientoDB.save();
//                 eliminados += 1;
//             }
//         }

//         console.log('Actualización de establecimientos completada.');
//         console.log(`Actualizados: ${actualizados}. Creados: ${creados}. Eliminados: ${eliminados}`)

//     } catch (error) {
//         console.log(error)
//     }
// }



const actualizarEstablecimientos = async (files, job) => {
    try {
        const archivo = files?.establecimientosEducativos;
        if (!archivo) {
            console.error("Debe ingresar un archivo con formato .xls con el nombre 'establecimientosEducativos'");
            return;
        }

        const workbook = xlsx.read(archivo.filepath, { type: 'file' });
        const worksheet = workbook.Sheets['padron'];

        // Convertir el contenido del archivo Excel a un arreglo de objetos
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 14 });

        // Filtrar las filas cuya provincia es "Córdoba"
        const dataCordoba = data.filter(row => row[0] === 'Córdoba');

        // Obtener todos los códigos CUE de los establecimientos del nuevo padrón
        const cuesNuevos = dataCordoba.map(row => row[7].substr(2));

        // Obtener todos los establecimientos de Córdoba en la base de datos
        const establecimientosDB = await EstablecimientoEducativo.find({ provincia: 'Córdoba' });

        // Crear un objeto para mapear los códigos CUE a documentos de establecimientos
        const establecimientosMap = establecimientosDB.reduce((acc, establecimiento) => {
            acc[establecimiento.cue] = establecimiento;
            return acc;
        }, {});

        // Identificar establecimientos a actualizar, crear y eliminar
        const operacionesBulk = {
            actualizaciones: [],
            creaciones: [],
            eliminaciones: [],
        };

        const batchSize = 100; // Tamaño del batch para informar progreso

        for (let i = 0; i < dataCordoba.length; i++) {
            const row = dataCordoba[i];
            const cueFromExcel = row[7];
            const cue = cueFromExcel.substr(2); // Quitar los dos primeros números

            // Obtener el establecimiento de la base de datos
            const establecimientoDB = establecimientosMap[cue];


            if (establecimientoDB) {
                // Si el establecimiento existe, comparar y preparar la actualización si es necesario
                if (establecimientoDB.nombre !== row[8] || 
                    establecimientoDB.provincia !== row[0] ||
                    establecimientoDB.departamento !== row[3] ||
                    establecimientoDB.localidad !== row[5] ||
                    establecimientoDB.domicilio !== row[9] ||
                    establecimientoDB.CP !== row[10] ||
                    establecimientoDB.telefono !== row[11] ||
                    establecimientoDB.email !== row[12] ||
                    !establecimientoDB.activo) {
                    operacionesBulk.actualizaciones.push({
                        updateOne: {
                            filter: { cue: establecimientoDB.cue },
                            update: {
                                $set: {
                                    nombre: row[8],
                                    provincia: row[0],
                                    departamento: row[3],
                                    localidad: row[5],
                                    domicilio: row[9],
                                    CP: row[10],
                                    telefono: row[11],
                                    email: row[12],
                                    activo: true,
                                },
                            },
                        },
                    });
                }
            } else {
                // Si el establecimiento no existe, preparar la creación
                operacionesBulk.creaciones.push({
                    insertOne: {
                        document: {
                            nombre: row[8],
                            cue,
                            provincia: row[0],
                            departamento: row[3],
                            localidad: row[5],
                            domicilio: row[9],
                            CP: row[10],
                            telefono: row[11],
                            email: row[12],
                            activo: true,
                        },
                    },
                });
            }

            // Informar progreso por cada línea
            //const progress = Math.round(((i + 1) / dataCordoba.length) * 100);
            //job.progress(progress);

            // Informar progreso por cada batch
            if (i > 0 && i % batchSize === 0) {
                const batchProgress = Math.round((i / dataCordoba.length) * 100);
                job.progress(batchProgress);
            }
        }

        // Identificar establecimientos a actualizar, crear y eliminar (continuación)
        for (const establecimientoDB of establecimientosDB) {
            if (!cuesNuevos.includes(establecimientoDB.cue)) {
                // Si el establecimiento de la base de datos no está en el nuevo padrón, preparar la baja lógica
                operacionesBulk.eliminaciones.push({
                    updateOne: {
                        filter: { cue: establecimientoDB.cue },
                        update: {
                            $set: {
                                activo: false,
                            },
                        },
                    },
                });
            }
        }

        // Realizar operaciones bulk en la base de datos
        const { actualizaciones, creaciones, eliminaciones } = operacionesBulk;

        if (actualizaciones.length > 0) {
            await EstablecimientoEducativo.bulkWrite(actualizaciones);
        }

        if (creaciones.length > 0) {
            await EstablecimientoEducativo.bulkWrite(creaciones);
        }

        if (eliminaciones.length > 0) {
            await EstablecimientoEducativo.bulkWrite(eliminaciones);
        }

        console.log('Actualización de establecimientos completada.');
        console.log(`Actualizados: ${actualizaciones.length}. Creados: ${creaciones.length}. Eliminados: ${eliminaciones.length}`);

        // Informar sobre el progreso
        job.progress(100);

    } catch (error) {
        console.error(error);
    }
};


const crearEstablecimientos = async (files, job) => {

    try {
        const archivo = files?.establecimientosEducativos;
        if (!archivo) {
            console.error("Debe ingresar un archivo con formato .xls con el nombre 'establecimientosEducativos'");
            return;
        }

        const workbook = xlsx.read(archivo.filepath, { type: 'file' });
        const worksheet = workbook.Sheets['padron'];

        // Convertir el contenido del archivo Excel a un arreglo de objetos
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 14 });

        // Filtrar las filas cuya provincia es "Córdoba"
        const dataCordoba = data.filter(row => row[0] === 'Córdoba');

        // Mapear los nombres de las columnas del Excel a los atributos del schema
        const mappedData = dataCordoba.map(row => {
            const dataObject = {};
        
            // Columna I - nombre
            dataObject['nombre'] = row[8];
        
            // Columna H - cue
            const cueFromExcel = row[7];
            const cue = cueFromExcel.substr(2); // Quitar los dos primeros números
            dataObject['cue'] = cue;
        
            // Columna A - provincia
            dataObject['provincia'] = row[0];
        
            // Columna D - departamento
            dataObject['departamento'] = row[3];
        
            // Columna F - localidad
            dataObject['localidad'] = row[5];
        
            // Columna J - domicilio
            dataObject['domicilio'] = row[9];
        
            // Columna K - CP
            dataObject['CP'] = row[10];
        
            // Columna L - telefono
            dataObject['telefono'] = row[11];
        
            // Columna M - email
            dataObject['email'] = row[12];
        
            return dataObject;
        });

        // Dividir los datos en lotes más pequeños
        const batchSize = 100; // Tamaño del lote
        let totalSaved = 0; // Contador de documentos almacenados

        for (let i = 0; i < mappedData.length; i += batchSize) {
            const batch = mappedData.slice(i, i + batchSize);
            const result = await EstablecimientoEducativo.insertMany(batch);
            totalSaved += result.length;
        }

        console.log(`Se han guardado ${totalSaved} documentos en la base de datos.`);
        
    } catch (error) {
        console.log(error)
    }
}