import { PostgresDataSource } from "./data/PostgresDataSource.js"
import { ENVS } from "./plugins/env.plugin.js"
import { Server } from "./presentation/Server.js"

async function main() {    
    await PostgresDataSource.initialize()
    const server = new Server()
    server.start()

}

(() => {
    main()
})()