import "reflect-metadata"

import { DataSource } from 'typeorm'
import { ENVS } from "../plugins/env.plugin.js"
import { Usuario } from "./models/Usuario.js"
import { Fondo } from "./models/Fondo.js"
import { Aportaciones } from "./models/Aportaciones.js"

export const PostgresDataSource = new DataSource({
    
    type: "postgres",

    host: ENVS.DB_HOST,
    port: ENVS.DB_PORT,
    username: ENVS.DB_USER,
    password: ENVS.DB_PASSWORD,
    database: ENVS.DB_NAME,

    synchronize: true,
    logging: true,
    entities: [Usuario, Fondo, Aportaciones],
    subscribers: [],
    migrations: []

})