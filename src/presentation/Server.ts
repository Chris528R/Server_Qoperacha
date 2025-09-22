import express from 'express'
import { ENVS } from '../plugins/env.plugin.js'

export class Server {

    private app = express()

    start() {
        this.app.listen(ENVS.PORT, () => {
            console.log(`Server running on ${ENVS.PORT}`);
            
        })
    }
}