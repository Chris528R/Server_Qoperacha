import type { Request } from "express";
import { generarToken, validarToken } from "../../plugins/token.plugin.js";
import { Encrypt } from "../../plugins/encripts.plugin.js";

export class AuthService {
    /**
     * Valida si el usuario esta autenticado a traves de un token de conexión.
     * @param {Object} req Request HTTP
     * @author Mendoza Castañeda José Ricardo.
     */
    public static auth = async (req : Request) : Promise<string> => {
        const token = req.header('token')
        if(!token)
            throw 'Usuario no autenticado'
        
        const mail = validarToken(token);
        if( !mail )
            throw 'Token invalido'

        return mail;
    }

    public static token = async (correo: string): Promise<string> => {
        return await generarToken(correo);
    }
}