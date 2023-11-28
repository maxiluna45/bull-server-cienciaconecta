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
        //this.app.use(cors({ origin: '*' }));
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