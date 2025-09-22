import jwt, { type JwtPayload } from 'jsonwebtoken'
import { ENVS } from './env.plugin.js'

/**
 * Genera un token de acceso al servidor.
 * @author Mendoza Castañeda José Ricardo.
 * @param data Data a encriptar
 * @returns Un string con el token generado
 */
export const generarToken = ( data : string ) : Promise<string> => {
    return new Promise( ( resolve, reject ) => {
        const payload = { data }
        jwt.sign(payload, ENVS.SECRET_KEY, (err, token) => {  
            if( err ) {
                console.error(err)
                reject('No se pudo generar el token')
            } else {
                resolve(token!!)
            }
        })
    })
} 
/**
 * Valida el token y devuelve la data desencriptada.
 * @author Mendoza Castañeda José Ricardo
 * @param token Token a validar
 * @returns La data del objeto o null si no funciona.
 */
export const validarToken = (token : string) : string | null => {
    try {
        const result = jwt.verify(token, ENVS.SECRET_KEY ) as JwtPayload;    
        return result.data;
    }
    catch(err) {
        return null
    }
}