import express from 'express'
import { ENVS } from '../plugins/env.plugin.js'
import { PaymentService } from './services/PaymentService.js';

export class Server {

    private app = express()

    start() {
        this.app.listen(ENVS.PORT, () => {
            console.log(`Server running on ${ENVS.PORT}`);
            const client: PaymentService = new PaymentService();
        })
    }
}