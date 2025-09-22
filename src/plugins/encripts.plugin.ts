import bcrypt from 'bcryptjs'

export namespace Encrypt {
    /** Función para encriptar la contraseña.
     * @author Rodriguez Mendoza Christopher
     * @author Mendoza Castañeda José Ricardo.
     * @param { String } password cadena de caracteres con la contraseña del usuario.
     * @returns la contraseña encriptada.
     */
    export const hashPassword = async (password : string) => {
        const saltRounds = 10; // Número de rondas de salto.
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }
    /**
     * Función para verificar la contraseña
     * @author Rodriguez Mendoza Christopher y Mendoza Castañeda José Ricardo
     * @param { String } password contraseña enviada.
     * @param { String } hashedPassword contraseña real encriptada.
     * @returns un booleano que indica si es igual o no.
     */
    export const verifyPassword = async (password : string, hashedPassword : string) => {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    }
}