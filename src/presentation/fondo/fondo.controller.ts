import type { Request, Response } from "express";
import { PostgresDataSource } from "../../data/PostgresDataSource.js";
import { Fondo } from "../../data/models/Fondo.js";
import { AuthService } from "../services/AuthService.js";
import { Usuario } from "../../data/models/Usuario.js";

export class FondoController {

    constructor(
        private readonly fondoRepository = PostgresDataSource.getRepository(Fondo),
        private readonly userRepository  = PostgresDataSource.getRepository(Usuario)
    ){}

    public getInfoFondo = async (req: Request, res: Response) => {
        try {
            await AuthService.auth(req)
            const { id } = req.params
            
            const fondo = await this.fondoRepository.findOne({
                where: {
                    wallet_address: id!
                },
                relations: {
                    aportaciones: true
                }
            });

            return res.status(200).json({ message: 'Obtener información del fondo' });
        }
        catch(err) {
            console.error(err);
            return res.status(400).json({ message: 'Error al obtener información del fondo', err });
        }
        
    }
    public createFondo = async (req: Request, res: Response) => {
        try {
            const email = await AuthService.auth(req)
            const usuario = await this.userRepository.findOneBy({ email: email })

            const { wallet_address, title, description, amount, amount_to_be_raised } = req.body
            const fondo = new Fondo()

            fondo.wallet_address = wallet_address
            fondo.title = title
            fondo.description = description
            fondo.amount = amount
            fondo.amount_to_be_raised = amount_to_be_raised
            fondo.creador = usuario!

            this.fondoRepository.save(fondo)
            
            return res.status(201).json({ message: 'Fondo Creado', wallet_address })
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener información del fondo' });
        }
    }
    public donateToFondo = (req: Request, res: Response) => {
        return res.status(200).json({ message: 'Donar al fondo' })
    }
}