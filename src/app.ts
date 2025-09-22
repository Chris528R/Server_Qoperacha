import { PostgresDataSource } from "./data/PostgresDataSource.js"
import { ENVS } from "./plugins/env.plugin.js"
import { AppRoutes } from "./presentation/AppRoutes.js"
import { Server } from "./presentation/Server.js"

async function main() {    
    // Inicialización de la base de datos.
    await PostgresDataSource.initialize()

    // Inicialización del servidor.
    const server = new Server(AppRoutes.routes)
    server.start()
}

(() => {
    main()
})()