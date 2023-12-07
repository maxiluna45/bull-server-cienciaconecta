import express from 'express';
import { config } from "./config/index.js"
import { arenaConfig } from "./arena.js"
import { queues } from "./queues.js"
import cors from 'cors';
import dbConnection from './database/config.js';

class Server {

    constructor(){
        this.app = express();
        this.port = config.port;
        this.host = config.host;


        this.middlewares();
        this.arena(queues);
        this.conectarDB();

    }

    middlewares(){
        //CORS
        this.app.use(cors({origin: '*'}));

        // this.app.use(function (req, res, next) {
        //     req.headers.origin = req.headers.origin || 'http://' + req.headers.host;
        //     next();
        //   });
        // //test cors
        // const whitelist = [process.env.ORIGIN1]

        // this.app.use(cors(
        //      {
        //      origin: function(origin, callback){
        //          if(whitelist.includes(origin)){
        //              return callback(null, origin) 
        //          }
        //          return callback("Error de CORS - Origin: " + origin + " No autorizado")
        //      },
        //      credentials: true  
        //      }
        // ))
    }
    
    arena(queues) {
        this.app.use('/', arenaConfig(queues));
    }
    async conectarDB(){
        await dbConnection();
    }
    listen(){
        this.app.listen( this.port , () => {
            console.log(`Servidor corriendo en: ${this.host}:${this.port}` );
            console.log(`Arena Dashboard corriendo en ${this.host}:${this.port}/arena`)
        });
    }

}

export default Server;