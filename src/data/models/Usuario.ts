import { Column, Entity, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Fondo } from "./Fondo.js"
import { Aportaciones } from "./Aportaciones.js"

@Entity()
export class Usuario {

    @PrimaryColumn("varchar")
    email: string

    @Column("varchar")
    name : string

    @Column("varchar")
    password: string
    
    @Column("varchar")
    wallet_address : string

    @OneToMany( () => Fondo, fondo => fondo.creador, { cascade: true })
    fondos_creados : Relation<Fondo[]>

    @OneToMany( () => Aportaciones, aportaciones => aportaciones.aportacion, { cascade: true })
    aportaciones : Relation<Aportaciones[]>
}