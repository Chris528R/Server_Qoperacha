import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Usuario } from "./Usuario.js";
import { Fondo } from "./Fondo.js";

export enum PaymentState {
    PAGADO = "pagado",
    PENDIENTE = "pendiente",
    CANCELADO = "cancelado"
}

@Entity()
export class Aportaciones {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    monto : number

    @Column()
    estado: string

    @ManyToOne(() => Usuario, usuario => usuario.aportaciones, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    usuario : Relation<Usuario>

    @ManyToOne( () => Fondo, fondo => fondo.aportaciones, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    fondo : Relation<Fondo>
}