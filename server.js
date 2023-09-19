import express from 'express';
import { config } from "./config/index.js"
import { arenaConfig } from "./arena.js"
import { queues } from "./queues.js"

class Server {

    constructor(){
        this.app = express();
        this.port = config.port;
        this.host = config.host;

        //conectar a base de datos
        this.arena(queues);
    }

    arena(queues) {
        this.app.use('/', arenaConfig(queues));
    }

    listen(){
        this.app.listen( this.port , () => {
            console.log(`Servidor corriendo en: ${this.host}:${this.port}` );
        });
    }

}

export default Server;