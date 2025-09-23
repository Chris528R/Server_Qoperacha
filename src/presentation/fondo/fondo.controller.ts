import type { Request, Response } from "express";
import { PostgresDataSource } from "../../data/PostgresDataSource.js";
import { Fondo } from "../../data/models/Fondo.js";
import { AuthService } from "../services/AuthService.js";
import { Usuario } from "../../data/models/Usuario.js";
import { PaymentService } from "../services/PaymentService.js";
import { Aportaciones, PaymentState } from "../../data/models/Aportaciones.js";
import { PaymentSession } from "../../data/models/PaymentSession.js";
import type { Quote, WalletAddress } from "@interledger/open-payments";

export class FondoController {

    constructor(
        private readonly fondoRepository = PostgresDataSource.getRepository(Fondo),
        private readonly userRepository  = PostgresDataSource.getRepository(Usuario),
        private readonly aportacionRepository = PostgresDataSource.getRepository(Aportaciones),
        private readonly paymentSessionRepository = PostgresDataSource.getRepository(PaymentSession),
        private readonly paymentService = new PaymentService()
    ){}

    public getInfoFondo = async (req: Request, res: Response) => {
        try {
            await AuthService.auth(req)
            const { wallet_address } = req.body
            
            const fondo = await this.fondoRepository.findOne({
                where: {
                    wallet_address: wallet_address
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

            const { title, description, amount, amount_to_be_raised } = req.body
            const fondo = new Fondo()

            fondo.wallet_address = usuario?.wallet_address as string
            fondo.title = title
            fondo.description = description
            fondo.amount = amount
            fondo.amount_to_be_raised = amount_to_be_raised
            fondo.creador = usuario!
            fondo.image = ""

            this.fondoRepository.save(fondo)
            
            return res.status(201).json({ message: 'Fondo Creado', wallet_address: fondo.wallet_address });
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

            if(!fondo) return res.status(404).json({ message: "No existe el fondo" })
            if(!usuario) return res.status(404).json({ message: "Usuario no encontrado" })

            const aportacion = this.aportacionRepository.create({
                monto: amount,
                usuario: usuario,
                fondo: fondo,
                estado: PaymentState.PENDIENTE
            });

            await this.aportacionRepository.save(aportacion);
            const paymentId = aportacion.id;

            const result = await this.paymentService.doPayment({
                senderWalletUrl: usuario.wallet_address, 
                receiverWalletUrl,
                amount,
                id: paymentId.toString()
            });

            const paymentSession = this.paymentSessionRepository.create({
                id: paymentId,
                continueUri: result.continueUri,
                continueAccessToken: result.continueAccessToken,
                senderWallet: result.senderWallet,
                quote: result.quote,
            });
            await this.paymentSessionRepository.save(paymentSession);
            
            return res.status(200).json({
                redirectUri: result.redirectUri,
                paymentId: paymentId
            })

        }
        catch(err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al iniciar la donación' });
        }
    }

    public handlePaymentCallback = async (req: Request, res: Response) => {
        const paymentId = parseInt(req.params.paymentId as string, 10);
        if (isNaN(paymentId)) 
            return res.status(400).redirect(`qoperachar://payment/complete?status=error&message=InvalidID`);

        const paymentSession = await this.paymentSessionRepository.findOneBy({ id: paymentId });

        const aportacion = await this.aportacionRepository.findOneBy({ id: paymentId });
        if (!paymentSession || !aportacion) 
            return res.status(404).redirect(`qoperachar://payment/complete?status=error&message=SessionNotFound`);
        if (aportacion.estado !== PaymentState.PENDIENTE)
            return res.status(400).redirect(`qoperachar://payment/complete?status=error&message=AlreadyProcessed`);

        try {
            await this.paymentService.finalizePayment({
                continueUri: paymentSession.continueUri,
                continueAccessToken: paymentSession.continueAccessToken,
                senderWallet: paymentSession.senderWallet as WalletAddress,
                quote: paymentSession.quote as Quote,
            });

            aportacion.estado = PaymentState.PAGADO;
            await this.aportacionRepository.save(aportacion);

            return res.status(200).redirect(`qoperachar://payment/complete?status=success&paymentId=${paymentId}`);
        }
        catch (err) {
            console.error(err);
            aportacion.estado = PaymentState.CANCELADO;
            await this.aportacionRepository.save(aportacion);
            const errorMessage = err instanceof Error ? err.message : 'UnknownError';
            return res.redirect(`qoperachar://payment/complete?status=error&paymentId=${paymentId}&message=${encodeURIComponent(errorMessage)}`);
        }
        finally{
            await this.paymentSessionRepository.delete(paymentSession);
        }
        
    }
    // public updateDB = async (req: Request, res: Response) => {
    
    // }
}