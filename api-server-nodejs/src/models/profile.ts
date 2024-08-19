import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("profile")
export class Profile {
  @PrimaryGeneratedColumn()
  profileId?: number;

  @Column({ type: "varchar", length: 36 })
  userId?: number;

  @Column({ length: 100 })
  name?: string;

  @Column({ length: 100, unique: true })
  email?: string;

  @Column({ length: 15 })
  phone?: string;

  @Column({ type: "enum", enum: ["Male", "Female", "Other"] })
  gender?: "Male" | "Female" | "Other";

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  country?: string;

  @Column({ length: 100, nullable: true })
  education?: string;

  @Column("text", { nullable: true })
  skills?: string;

  @Column("text", { nullable: true })
  description?: string;
}
