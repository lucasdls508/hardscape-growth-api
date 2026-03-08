import { AgencyProfile } from "src/agency_profiles/entities/agency_profiles.entity";
import { Lead } from "src/leads_info/entities/lead.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELED = "canceled",
}
@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid" })
  agency_owner_id: string;

  @Column({ type: "uuid", nullable: true })
  constructor_id: string; // Corrected spelling from ERD 'contructor_id'

  @Column({ type: "uuid" })
  lead_id: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  lead_contact: string;

  @Column({ type: "timestamp" })
  start_time: Date;

  @Column({ type: "timestamp" })
  end_time: Date;
  @Column({ type: "varchar", enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status: AppointmentStatus;

  // --- Relationships ---

  @ManyToOne(() => AgencyProfile)
  @JoinColumn({ name: "agency_owner_id" })
  agencyOwner: AgencyProfile;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'constructor_id' })
  // constructor: User;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: "lead_id" })
  lead: Lead;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
