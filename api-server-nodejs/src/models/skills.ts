import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category";
import { JobDetails } from "./job_details";

@Entity("skill")
export class Skill {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 255 })
  skillName?: string;

  @ManyToOne(() => Category, (category) => category.skills)
  category?: Category;

  @OneToMany(() => JobDetails, (jobDetails) => jobDetails.skills_id)
  jobDetails?: JobDetails[];
}
