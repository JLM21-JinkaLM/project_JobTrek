import express from "express";
import { getRepository, MoreThanOrEqual, getConnection } from "typeorm";
import { JobDetails as job_details } from "../models/job_details";

import { Location as location } from "../models/location";
import { Skill as skill } from "../models/skills";
import { Category as category } from "../models/category";
import { JobSkills } from "../models/jobskills";

const adminRouter = express.Router();
adminRouter.post("/jobcreate", async (req, res) => {
  const jobDetailsRepository = getRepository(job_details);
  const jobSkillsRepository = getRepository(JobSkills);
  const skillRepository = getRepository(skill);
  const categoryRepository = getRepository(category);

  const {
    title,
    description,
    location_id,
    salary,
    skills_id, // Array of skill names
    category_id,
    dateOfPost,
    lastDate,
    education,
    experience,
    jobtype,
  } = req.body;

  try {
    // Match each skill name with its ID in the Skill table
    const skillIds = await Promise.all(
      skills_id.map(async (skillName: string) => {
        const skills = await skillRepository.findOne({ where: { skillName } });
        if (skills) {
          return skills.id;
        } else {
          throw new Error(`Skill not found: ${skillName}`);
        }
      })
    );

    // Convert skillIds array into a comma-separated string
    const skillsIdString = skillIds.join(",");
    console.log(skillsIdString, "11111111111111");

    // Create a new job entry
    const newJob = jobDetailsRepository.create({
      title,
      description,
      location_id,
      salary,
      category_id,
      dateOfPost,
      lastDate,
      education,
      experience,
      jobtype,
      skills_id: skillsIdString, // Store the string of skill IDs
    });

    // Save the new job entry to the database
    const savedJob = await jobDetailsRepository.save(newJob);

    // Prepare a job skills record
    const jobSkillsRecord = {
      job_details_id: savedJob.id,
      skills_id: skillsIdString,
    };

    // Insert job skills record into the jobcreate_skills_id table
    const savedSkillIds = await jobSkillsRepository.save(jobSkillsRecord);

    // Find the inserted job skills record to update the job's skill_id
    const job = await jobSkillsRepository.findOne(savedSkillIds.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update the job's skills_id with the job skills record ID
    savedJob.skills_id = job.id;
    await jobDetailsRepository.save(savedJob);

    // Update category count
    const categoryToUpdate = await categoryRepository.findOne(category_id);
    if (categoryToUpdate) {
      categoryToUpdate.count = (categoryToUpdate.count || 0) + 1;
      await categoryRepository.save(categoryToUpdate);
    } else {
      console.error("Category not found:", category_id);
    }

    res.status(201).json(savedJob); // Respond with the created job details
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ error: "Error saving job" }); // Handle errors
  }
});

// adminRouter.post("/jobcreate", async (req, res) => {
//   const jobDetailsRepository = getRepository(job_details);
//   const jobSkillsRepository = getRepository(JobSkills);
//   const skillRepository = getRepository(skill);

//   const {
//     title,
//     description,
//     location_id,
//     salary,
//     skills_id, // Array of skill names
//     category_id,
//     dateOfPost,
//     lastDate,
//     education,
//     experience,
//     jobtype,
//   } = req.body;

//   try {
//     // Match each skill name with its ID in the Skill table
//     const skillIds = await Promise.all(
//       skills_id.map(async (skillName: string) => {
//         const skills = await skillRepository.findOne({ where: { skillName } });
//         if (skills) {
//           return skills.id;
//         } else {
//           throw new Error(`Skill not found: ${skillName}`);
//         }
//       })
//     );

//     // Convert skillIds array into a comma-separated string
//     const skillsIdString = skillIds.join(",");
//     console.log(skillsIdString, "11111111111111");
    
//     // Create a new job entry
//     const newJob = jobDetailsRepository.create({
//       title,
//       description,
//       location_id,
//       salary,
//       category_id,
//       dateOfPost,
//       lastDate,
//       education,
//       experience,
//       jobtype,
//       skills_id: skillsIdString, // Store the string of skill IDs
//     });

//     // Save the new job entry to the database
//     const savedJob = await jobDetailsRepository.save(newJob);

//     // Prepare a job skills record
//     const jobSkillsRecord = {
//       job_details_id: savedJob.id,
//       skills_id: skillsIdString,
//     };

//     // Insert job skills record into the jobcreate_skills_id table
//     const savedSkillIds = await jobSkillsRepository.save(jobSkillsRecord);

//     // Find the inserted job skills record to update the job's skill_id
//     const job = await jobSkillsRepository.findOne(savedSkillIds.id);
//     if (!job) {
//       return res.status(404).json({ error: "Job not found" });
//     }

//     // Update the job's skills_id with the job skills record ID
//     savedJob.skills_id = job.id;
//     await jobDetailsRepository.save(savedJob);

//     res.status(201).json(savedJob); // Respond with the created job details
//   } catch (error) {
//     console.error("Error saving job:", error);
//     res.status(500).json({ error: "Error saving job" }); // Handle errors
//   }
// });

adminRouter.get("/jobdetails", async (_req, res) => {
  try {
    const jobRepository = getRepository(job_details);
    const jobSkillsRepository = getRepository(JobSkills);
    const locationRepository = getRepository(location);
    const skillRepository = getRepository(skill);
    const categoryRepository = getRepository(category);

    // Find all jobs
    const jobs = await jobRepository.find({});

    // Prepare the response array
    const jobsWithDetails: any[] = [];

    for (const job of jobs) {
      // Fetch related entities
      const location1 = await locationRepository.findOne({
        id: job.location_id,
      });

      const category1 = await categoryRepository.findOne({
        id: job.category_id,
      });

      // Fetch skills_id from jobcreate_skills_id using jobs.skills_id
      const jobSkillEntry = await jobSkillsRepository.findOne({
        id: job.skills_id, // This is the primary key ID in jobcreate_skills_id table
      });

      // Initialize skillNames with an empty array
      let skillNames: string[] = [];

      if (jobSkillEntry && jobSkillEntry.skills_id) {
        const skillIds = jobSkillEntry.skills_id.split(",").map(Number);

        // Fetch skill names from the skill table
        const skillsEntities = await skillRepository.findByIds(skillIds);

        // Map the skill IDs to their names, filtering out any undefined values
        skillNames = skillsEntities
          .map((skill) => skill.skillName)
          .filter((name): name is string => !!name); // Filter out undefined
      }

      // Build the job detail with names
      const jobWithDetails = {
        ...job,
        location_name: location1 ? location1.location_name : null,
        skill_names: skillNames, // Array of skill names
        category_name: category1 ? category1.categoryName : null,
      };

      jobsWithDetails.push(jobWithDetails);
    }

    res.status(200).json({ success: true, jobs: jobsWithDetails });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ success: false, msg: "Error fetching jobs" });
  }
});

adminRouter.delete("/jobdelete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Start a transaction
    await getConnection().transaction(async (transactionalEntityManager) => {
      const jobRepository =
        transactionalEntityManager.getRepository(job_details);
      const jobSkillsRepository =
        transactionalEntityManager.getRepository(JobSkills);

      // Delete from jobcreate_skills_id table
      await jobSkillsRepository.delete({ job_details_id: id });

      // Delete from job_details table
      const result = await jobRepository.delete(id);

      if (result.affected === 1) {
        res
          .status(200)
          .json({ message: "Job and associated skills deleted successfully" });
      } else {
        res.status(404).json({ message: "Job not found or already deleted" });
      }
    });
  } catch (error) {
    const err = error as any;
    console.error("Error deleting job and associated skills:", err);
    res.status(500).json({
      message: "Error deleting job and associated skills",
      error: err.message,
    });
  }
});
adminRouter.get("/job/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const jobRepository = getRepository(job_details);
    const jobSkillsRepository = getRepository(JobSkills);
    const skillRepository = getRepository(skill);

    // Fetch job details by id
    const job = await jobRepository.findOne(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Fetch skill IDs associated with the job from jobcreate_skills_id table
    const jobSkills = await jobSkillsRepository.find({
      where: { job_details_id: id },
    });

    if (!jobSkills.length) {
      return res.status(200).json({ ...job, skill_names: [] });
    }

    // Filter out any undefined skill IDs and split valid skill IDs
    const skillIdStrings = jobSkills
      .map((js) => js.skills_id)
      .filter((idString): idString is string => idString !== undefined);

    const skillIds = skillIdStrings
      .flatMap((idString) => idString.split(",").map((id) => id.trim()))
      .filter((id) => id); // Remove any empty IDs

    // Fetch skill names from the Skill table using the extracted skill IDs
    const skills = await skillRepository.findByIds(skillIds);

    // Extract skill names
    const skillNames = skills.map((skill) => skill.skillName);

    // Adjust property name based on your Skill entity

    // Combine job details with the skill names and return as response
    res.json({ ...job, skill_names: skillNames.join(", ") });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
});
// PUT update job details by ID
adminRouter.put("/jobupdate/:id", async     (req, res) => {
  const jobRepository = getRepository(job_details);
  const skillRepository = getRepository(skill);
  const jobSkillsRepository = getRepository(JobSkills);

  const { id } = req.params;
  const {
    title,
    description,
    location_id,
    salary,
    skills_id,
    category_id,
    dateOfPost,
    lastDate
  } = req.body;
  console.log( skills_id, "fffff");
  try {
   
    let job = await jobRepository.findOne(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
  
    const skills = await skillRepository.find({
      where: skills_id.map((skillName: string) => ({ skillName })),
    });
    console.log(skills);
    const skillIds = skills.map((skill) => skill.id).join(",");
    
    let jobSkill = await jobSkillsRepository.find({
      where: { job_details_id: id },
    });
    // let id_from_skills = 
    console.log(jobSkill[0].id);
    

    // Update job details
    job.title = title;
    job.description = description;
    job.location_id = location_id;
    job.salary = salary;
    job.skills_id = jobSkill[0].id;
    job.category_id = category_id;
    job.dateOfPost = dateOfPost;
    job.lastDate = lastDate;
    jobSkill[0].skills_id = skillIds;
    await jobRepository.save(job);
    await jobSkillsRepository.save(jobSkill);
    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
});

// adminRouter.put("/jobupdate/:id", async (req, res) => {
//   const jobRepository = getRepository(job_details);
//   const skillRepository = getRepository(skill);
//   const jobSkillsRepository = getRepository(JobSkills);

//   const { id } = req.params;
//   const {
//     title,
//     description,
//     location_id,
//     salary,
//     skills_id,  // Array of skill names
//     category_id,
//     dateOfPost,
//     lastDate,
//   } = req.body;

//   try {
//     // Find the job by ID
//     let job = await jobRepository.findOne(id);
//     if (!job) {
//       return res.status(404).json({ error: "Job not found" });
//     }

//     // Match each skill name with its ID in the Skill table
//     const skillIds = await Promise.all(
//       skills_id.map(async (skillName:String) => {
//         const skill = await skillRepository.findOne({ where: { skillName } });
//         if (skill) {
//           return skill.id;
//         } else {
//           throw new Error(`Skill not found: ${skillName}`);
//         }
//       })
//     );

//     // Convert skillIds array into a comma-separated string
//     const skillsIdString = skillIds.join(",");

//     // Update job details
//     job.title = title;
//     job.description = description;
//     job.location_id = location_id;
//     job.salary = salary;
//     job.skills_id = skillsIdString;
//     job.category_id = category_id;
//     job.dateOfPost = dateOfPost;
//     job.lastDate = lastDate;

//     // Find the corresponding job skill record
//     let jobSkill = await jobSkillsRepository.find({
//       where: { job_details_id: id },
//     });
//     console.log(jobSkill,"ddddddddd");
    
//     if (jobSkill.length > 0) {
//       jobSkill[0].skills_id = skillsIdString;
//       await jobSkillsRepository.save(jobSkill[0]);
//     }

//     // Save the updated job details
//     await jobRepository.save(job);

//     res.json({ message: "Job updated successfully", job });
//   } catch (error) {
//     console.error("Error updating job:", error);
//     res.status(500).json({ error: "Failed to update job" });
//   }
// });



adminRouter.get("/totalcount", async (_req, res) => {
  try {
    const jobDetailsRepository = getRepository(job_details);
    const totalCount = await jobDetailsRepository.count();
    res.json({ count: totalCount });
  } catch (error) {
    console.error("Error fetching total job listings count:", error);
    res.status(500).json({ error: "Failed to fetch total job listings count" });
  }
});

adminRouter.get("/activejobs/count", async (_req, res) => {
  try {
    const jobDetailsRepository = getRepository(job_details);

    // Calculate today's date
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC

    // Fetch count of jobs where lastDate is greater than or equal to today
    const activeJobsCount = await jobDetailsRepository.count({
      where: {
        lastDate: MoreThanOrEqual(today.toISOString()), // Assuming lastDate is stored as ISOString
      },
    });

    res.status(200).json({ count: activeJobsCount });
  } catch (error) {
    console.error("Error fetching active jobs count:", error);
    res.status(500).json({ error: "Failed to fetch active jobs count" });
  }
});

adminRouter.get("/jobcounts", async (_req, res) => {
  try {
    const jobDetailsRepository = getRepository(job_details);

    const categories = [
      "Software Development",
      "Marketing",
      "Finance",
      "Design",
    ];
    const counts = await Promise.all(
      categories.map(async (category) => {
        const count = await jobDetailsRepository.count({ where: { category } });
        return { category, count };
      })
    );

    const jobCounts = counts.reduce((acc, { category, count }) => {
      acc[category] = count;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({ counts: jobCounts });
  } catch (error) {
    console.error("Error fetching job counts:", error);
    res.status(500).json({ error: "Failed to fetch job counts" });
  }
});

export default adminRouter;
