import Queue from "bull";
import { config } from "./config/index.js"
import  { emailWorker } from "./workers/email.js"

const email = new Queue("email", { redis: config.redis });
email.process((job, done) => emailWorker(job, done));

export const queues = [
    {
      name: "email",
      hostId: "Email Queue Manager",
      redis: config.redis,
    },
];