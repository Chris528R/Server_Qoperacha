import { Router } from "express";
import { UsuarioController } from "./usuario.controller.js";

export class UserRoutes {
    static get routes() : Router {
        const router = Router()
        const userController = new UsuarioController()

        // Get personal Info
        router.get('/',         userController.getPersonalInfo)
        // Register user
        router.post('/',        userController.registerUser)

        // Login user
        router.post("/auth",    userController.loginUser)

        return router
    }
}