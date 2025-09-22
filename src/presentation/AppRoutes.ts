import { Router } from "express";
import { UserRoutes } from "./usuario/usuario.routes.js";
import { FondoRoutes } from "./fondo/fondo.routes.js";

export class AppRoutes {
    static get routes() : Router {
        const router = Router()

        router.use('/user', UserRoutes.routes)
        router.use('/fondo', FondoRoutes.routes)
        
        return router
    }
}