import { Router } from "express";
import { FondoController } from "./fondo.controller.js";

export class FondoRoutes {
    
    static get routes() : Router {

        const router = Router()
        const fondoController = new FondoController()
        // * Crear un nuevo fondo (Usuario logeado)
        router.post('/',fondoController.createFondo )

        // * Mostrar información del fondo
        router.get('/info', fondoController.getInfoFondo)

        // Realizar una aportación al fondo. (Usuario logeado)
        router.post('/donate', fondoController.donateToFondo)

        // Actualizar DB
        router.get('/paymentComplete/:paymentId', fondoController.handlePaymentCallback)


        return router
    
    }

}