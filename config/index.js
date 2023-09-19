export const config = {
    port: process.env.PORT,
    host: process.env.HOST,
    redis:  {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        db: process.env.REDIS_DB,
    }
}