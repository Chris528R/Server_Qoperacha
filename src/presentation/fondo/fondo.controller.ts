import type { Request, Response } from "express";
import { PostgresDataSource } from "../../data/PostgresDataSource.js";
import { Fondo } from "../../data/models/Fondo.js";
import { AuthService } from "../services/AuthService.js";
import { Usuario } from "../../data/models/Usuario.js";
import { PaymentService } from "../services/PaymentService.js";
import { Aportaciones, PaymentState } from "../../data/models/Aportaciones.js";

export class FondoController {

    constructor(
        private readonly fondoRepository = PostgresDataSource.getRepository(Fondo),
        private readonly userRepository  = PostgresDataSource.getRepository(Usuario),
        private readonly aportacionRepository = PostgresDataSource.getRepository(Aportaciones),
        private readonly paymentService = new PaymentService()
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

            return res.status(200).json(fondo);
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
            fondo.image = ""

            this.fondoRepository.save(fondo)
            
            return res.status(201).json({ message: 'Fondo Creado', wallet_address })
        }
        catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener información del fondo' });
        }
    }
    public donateToFondo = async (req: Request, res: Response) => {
        try {
            const email     = await AuthService.auth(req)
            const usuario   = await this.userRepository.findOneBy({ email })

            const { receiverWalletUrl, amount } = req.body;

            const fondo = await this.fondoRepository.findOneBy({ wallet_address: receiverWalletUrl })

            if(!fondo)
                return res.status(400).json({ message: "no existe el fondo" })

            const aportacion = new Aportaciones()
            aportacion.monto = amount
            aportacion.fondo = fondo
            aportacion.estado = PaymentState.PENDIENTE
            aportacion.usuario = usuario!

            await this.aportacionRepository.save(aportacion)

            const result = await this.paymentService.doPayment({
                senderWalletUrl: usuario!.wallet_address, 
                receiverWalletUrl,
                amount,
                id: aportacion.id
            })
            
            return res.status(200).json(result)

        }
        catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al obtener información del fondo' });
        }
    }
    public updateDB = async (req: Request, res: Response) => {
    
    }
}