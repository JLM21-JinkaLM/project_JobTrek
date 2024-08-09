import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { JobDetails } from './job_details'; // Adjust the import path if necessary
// import { Skill } from "./skills"; // Adjust the import path if necessary

@Entity('jobcreate_skills_id')
export class JobSkills {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: 'varchar',length:"10", nullable:true })
  job_details_id?: string;

  @Column({ type: "varchar", length: 255 })
  skills_id?: string;

  @ManyToOne(() => JobDetails, (jobDetails) => jobDetails.skill, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "job_details_id" })
  jobDetails?: JobDetails;

  // You can optionally add a ManyToOne relation to the Skill entity if needed
  // @ManyToOne(() => Skill, (skill) => skill.jobSkills)
  // @JoinColumn({ name: "skills_id" })
  // skill: Skill;
}
