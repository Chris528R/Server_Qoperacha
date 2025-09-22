import type { Request, Response } from "express";

export class FondoController {
    public getInfoFondo = (req: Request, res: Response) => {
        return res.status(200).json({ message: 'Obtener información del fondo' });
    }
    public createFondo = (req: Request, res: Response) => {
        return res.status(200).json({ message: 'Crear fondo' })
    }
    public donateToFondo = (req: Request, res: Response) => {
        return res.status(200).json({ message: 'Donar al fondo' })
    }
}