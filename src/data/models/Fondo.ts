import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, type Relation } from "typeorm"
import { Usuario } from "./Usuario.js"
import { Aportaciones } from "./Aportaciones.js"

@Entity()
export class Fondo {

    @PrimaryColumn("varchar")
    wallet_address : string

    @Column("varchar")
    title : string

    @Column("varchar")
    description : string

    @Column()
    amount : number

    @Column()
    amount_to_be_raised : number

    @Column("varchar")
    image : string

    @ManyToOne( () => Usuario, usuario => usuario.fondos_creados, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    creador : Relation<Usuario>

    @OneToMany( () => Aportaciones, aportacion => aportacion.fondo, { cascade: true })
    aportaciones : Relation<Aportaciones[]>
}