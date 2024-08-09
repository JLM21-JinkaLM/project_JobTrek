import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { JobDetails } from "./job_details";

@Entity("location")
export class Location {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 255 })
  location_name?: string;

  @Column({ type: "varchar", length: 255 })
  country?: string;

  @OneToMany(() => JobDetails, (jobDetails) => jobDetails.locationDetail)
  jobDetails?: JobDetails[];
}
