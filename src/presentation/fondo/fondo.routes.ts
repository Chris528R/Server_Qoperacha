import { Router } from "express";
import { FondoController } from "./fondo.controller.js";

export class FondoRoutes {
    
    static get routes() : Router {

        const router = Router()
        const fondoController = new FondoController()
        // * Crear un nuevo fondo (Usuario logeado)
        router.post('/',fondoController.createFondo )

        // * Mostrar información del fondo
        router.get('/:id', fondoController.getInfoFondo)

        // Realizar una aportación al fondo. (Usuario logeado)
        router.put('/:id', fondoController.donateToFondo)

        // Actualizar DB
        router.get('/paymentComplete', fondoController.updateDB)


        return router
    
    }

}