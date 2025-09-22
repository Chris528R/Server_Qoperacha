import type { Request, Response } from "express";
import { Usuario } from "../../data/models/Usuario.js";
import { PostgresDataSource } from "../../data/PostgresDataSource.js";
import { Encrypt } from "../../plugins/encripts.plugin.js";
import { generarToken } from "../../plugins/token.plugin.js";
import { AuthService } from "../services/AuthService.js";

export class UsuarioController {

    constructor(
        private readonly userRepository = PostgresDataSource.getRepository(Usuario)
    ) {}

    public getPersonalInfo = async (req: Request, res: Response) => {
        try {
            const email = await AuthService.auth(req)
            const usuario = await this.userRepository.findOne({
                where: {
                    email
                },
                relations: {
                    fondos_creados: true
                }
            })
            if(!usuario)
                return res.status(500).json({
                    message: 'Usuario no encontrado'
                })
            
            const { password, ...data } = usuario
            return res.status(200).json(data)
        }
        catch(err) {
            return res.status(400).json({
                message: err
            })
        }
    }
    public registerUser = async (req: Request, res: Response) => {
        try {
            const { email, name, password, wallet_address } = req.body

            const usuario = new Usuario()

            usuario.email = email
            usuario.name = name
            usuario.password = await Encrypt.hashPassword(password)
            usuario.wallet_address = wallet_address

            await this.userRepository.save(usuario);

            return res.status(201).json({ message: 'Usuario Registrado correctamente',  })
        }
        catch(err) {
            console.log(err);
            
            return res.status(500).json({ message: 'Error al registrar el usuario' });
        }
    }
    public loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const usuario = await this.userRepository.findOneBy({ 
                email
            })
            if(!usuario)
                return res.status(400).json({ message: 'Usuario no encontrado' })
            const isValidPassword = await Encrypt.verifyPassword(password, usuario.password)

            if(!isValidPassword)
                return res.status(400).json({ message: 'Contraseña incorrecta' })

            return res.status(200).json({ 
                message: 'Iniciar sesión',
                token: await generarToken(usuario.email) 
            })
        }
        catch(err) {
            return res.status(500).json({ message: 'Error al iniciar sesión' });
        }
    }
}