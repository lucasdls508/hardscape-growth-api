import { EstimateCatalogs } from "src/estimates/estimates_catalogs/entities/estimate_catalogs.entity";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("catalogs")
export class Catalogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", type: "varchar", length: 100 })
  name: string;

  @Column({ name: "desc", type: "varchar", length: 500 })
  desc: string;

  @Column({ name: "unit", type: "decimal" })
  unit: number;

  @Column({
    name: "material_unit_cost",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  material_unit_cost: number;

  @Column({
    name: "material_unit_price",
    type: "decimal",
    precision: 10,
    scale: 2,
  })
  material_unit_price: number;

  // One catalog used in many estimate line items
  @OneToMany(() => EstimateCatalogs, (ec) => ec.catalog)
  estimate_catalogs: EstimateCatalogs[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
