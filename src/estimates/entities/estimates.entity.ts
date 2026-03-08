import { ApiProperty } from "@nestjs/swagger";
import { Lead } from "src/leads_info/entities/lead.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EstimateCatalogs } from "../estimates_catalogs/entities/estimate_catalogs.entity";

export enum EstimateStatus {
  UN_SIGNED = "unsigned",
  CANCELED = "canceled",
  CONFIRMED = "confirmed",
  DEPOSIT_PAID = "deposit_paid",
}
@Entity("estimates")
export class Estimates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "estimate_no", type: "int" })
  estimate_no: number;

  @Column({ name: "prepared_for", type: "uuid" })
  prepared_for: string;

  @Column({ name: "prepared_by", type: "uuid" })
  prepared_by: string;

  @ManyToOne(() => Lead, (lead) => lead.estimates)
  @JoinColumn({ name: "prepared_for" })
  lead: Lead;

  @ManyToOne(() => User, (user) => user.estimates)
  @JoinColumn({ name: "prepared_by" })
  prepared_by_user: User;

  @OneToMany(() => EstimateCatalogs, (estimate_catalogs) => estimate_catalogs.estimate)
  estimate_catalogs: EstimateCatalogs[];

  @Column({ name: "terms_and_conditions", type: "varchar" })
  terms_and_conditions: string;

  @Column({ type: "varchar", nullable: true })
  contructor_signature: string;

  @Column({ type: "varchar", nullable: true })
  lead_signature: string;

  @Column({ type: "varchar", default: EstimateStatus.UN_SIGNED })
  status: EstimateStatus;

  @Column({ type: "varchar", nullable: true })
  stripe_session_id: string;

  @Column({ type: "varchar", nullable: true })
  stripe_payment_url: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty()
  deletedAt: Date;
}
