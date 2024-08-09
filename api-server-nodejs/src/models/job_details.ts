// import {
//   Entity,
//   Column,
//   ManyToOne,
//   JoinColumn,
//   PrimaryGeneratedColumn,
// } from "typeorm";
// import { Category } from "./category";
// import { Skill } from "./skills";
// import { Location } from "./location";

// @Entity()
// export class JobDetails {
//   @PrimaryGeneratedColumn("uuid")
//   id?: string;

//   @Column({ type: "varchar", length: 255 })
//   title?: string;

//   @Column({ type: "text" })
//   description?: string;

//   @Column({ type: "varchar", length: 255 })
//   salary?: string;

//   @Column({ type: "varchar", length: 255 })
//   education?: string;

//   @Column({ type: "varchar", length: 255 })
//   experience?: string;

//   @Column({ type: "varchar", length: 255 })
//   jobtype?: string;

//   @Column({ type: "int", nullable: true })
//   skills_id?: number;

//   @Column({ type: "int", nullable: true })
//   category_id?: number;

//   @Column({ type: "int", nullable: true })
//   location_id?: number;

//   @Column({ type: "date" })
//   dateOfPost?: Date;

//   @Column({ type: "date" })
//   lastDate?: Date;

//   @ManyToOne(() => Category, (category) => category.jobDetails)
//   @JoinColumn({ name: "category_id" })
//   category?: Category;

//   @ManyToOne(() => Skill, (skill) => skill.jobDetails)
//   @JoinColumn({ name: "skills_id" })
//   skill?: Skill;

//   @ManyToOne(() => Location, (location) => location.jobDetails)
//   @JoinColumn({ name: "location_id" })
//   locationDetail?: Location;
// }




import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Category } from "./category";
import { Skill } from "./skills";
import { Location } from "./location";


@Entity()
export class JobDetails {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "varchar", length: 255 })
  title?: string;

  @Column({ type: "text" })
  description?: string;

  @Column({ type: "varchar", length: 255 })
  salary?: string;

  @Column({ type: "varchar", length: 255 })
  education?: string;

  @Column({ type: "varchar", length: 255 })
  experience?: string;

  @Column({ type: "varchar", length: 255 })
  jobtype?: string;

  
  @Column({ type: "varchar", length: 255 })
  skills_id?: string;

  @Column({ type: "int", nullable: true })
  category_id?: number;

  @Column({ type: "int", nullable: true })
  location_id?: number;


  @ManyToMany(() => Skill, { cascade: true })
  @JoinTable({
    name: "job_skills", // This is the name of the join table
    joinColumn: { name: "job_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "skill_id", referencedColumnName: "id" },
  })
  skill?: Skill[];

  @ManyToOne(() => Category, (category) => category.jobDetails)
  @JoinColumn({ name: "category_id" })
  category?: Category;

  @ManyToOne(() => Location, (location) => location.jobDetails)
  @JoinColumn({ name: "location_id" })
  locationDetail?: Location;

  @Column({ type: "date" })
  dateOfPost?: Date;

  @Column({ type: "date" })
  lastDate?: Date;
}
