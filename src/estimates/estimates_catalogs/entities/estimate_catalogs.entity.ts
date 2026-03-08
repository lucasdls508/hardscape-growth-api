import { Catalogs } from "src/catalogs/enitities/catalogs.entity";
import { Estimates } from "src/estimates/entities/estimates.entity";
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

@Entity("estimate_catalogs")
export class EstimateCatalogs {
  @PrimaryGeneratedColumn()
  id: number;
  // Foreign key to Estimates
  @Column({ type: "int", name: "estimate_id" })
  estimate_id: number;

  // Relationship to Estimates
  @ManyToOne(() => Estimates, (estimate) => estimate.estimate_catalogs)
  @JoinColumn({ name: "estimate_id" })
  estimate: Estimates;

  // Foreign key to Catalogs
  @Column({ type: "int", name: "catalog_id" })
  catalog_id: number;

  // Relationship to Catalogs
  @ManyToOne(() => Catalogs, (catalogs) => catalogs.estimate_catalogs)
  @JoinColumn({ name: "catalog_id" })
  catalog: Catalogs;

  // Line item specifics
  @Column({ type: "decimal", name: "quantity", precision: 10, scale: 2 })
  quantity: number;

  @Column({
    name: "unit_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unit_cost: number;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  unit_price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
