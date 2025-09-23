import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity()
export class PaymentSession {
  @PrimaryColumn("int")
  id: number;

  @Column({ default: "PENDING" }) // PENDING, COMPLETED, FAILED
  status: string;

  @Column()
  continueUri: string;

  @Column()
  continueAccessToken: string;

  @Column("jsonb")
  senderWallet: object;

  @Column("jsonb")
  quote: object;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}