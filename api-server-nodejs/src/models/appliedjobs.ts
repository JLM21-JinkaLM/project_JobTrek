import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class appliedjobs {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  jobid!: string;

  @Column({ type: "varchar", length: 100 }) // Assuming userid is a UUID string
  userid!: string;

  @Column({ type: "varchar", length: 50, default: "Pending" })
  status!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  dateofapplied!: Date;
}
