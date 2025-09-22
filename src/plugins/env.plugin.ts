import 'dotenv/config'

import env from 'env-var'

export const ENVS = {
    // Server PORT and public data.
    PORT: env.get('PORT').required().asPortNumber(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').asString(),

    // Database Connection.
    DB_USER: env.get('DB_USER').required().asString(),
    DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
    DB_HOST: env.get('DB_HOST').required().asString(),
    DB_PORT: env.get('DB_PORT').required().asPortNumber(),
    DB_NAME: env.get('DB_NAME').required().asString(),

    // Secret Key of Jsonwebtoken.
    SECRET_KEY: env.get('SECRET_KEY').required().asString()
}