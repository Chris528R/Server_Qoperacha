import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Usuario } from "./Usuario.js";
import { Fondo } from "./Fondo.js";

@Entity()
export class Aportaciones {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Usuario, usuario => usuario.aportaciones, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    usuario : Relation<Usuario>

    @Column()
    aportacion : number

    @ManyToOne( () => Fondo, fondo => fondo.aportaciones, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    fondo : Relation<Fondo>
}