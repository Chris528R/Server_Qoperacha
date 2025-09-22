import express, { Router, urlencoded } from 'express'
import cors from 'cors'

import { ENVS } from '../plugins/env.plugin.js'

export class Server {

    private app = express()

    constructor(
        private readonly routes : Router 
    ) {
        this.app.disable('x-powered-by')
    }

    start() {
        // * Body JSON parser
        this.app.use(express.json())
        // * Url form-encodede
        this.app.use(express.urlencoded({ extended: true }))
        // * Public folder Use
        this.app.use(express.static(ENVS.PUBLIC_PATH || 'public'))
        // * CORS Use
        this.app.use(cors())

        // * Routes Configuration
        this.app.use( this.routes )

        // * Server Listening
        this.app.listen(ENVS.PORT, () => {
            console.log(`Server running on ${ENVS.PORT}`);  
        })
    }
}