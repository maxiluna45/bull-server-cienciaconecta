import Queue from "bull";
import { config } from "./config/index.js";
import  { emailWorker } from "./workers/email.js";
import {fileWorker} from "./workers/file.js";

const email = new Queue("email", { redis: config.redis });
email.process((job, done) => emailWorker(job, done));

const file = new Queue("file",{redis: config.redis});
file.process((job, done) => fileWorker(job,done));

export const queues = [
    {
      name: "email",
      hostId: "Email Queue Manager",
      redis: config.redis,
    },
    {
      name:"file",
      hostId:"File Queue Manager",
      redis: config.redis,
    }
];