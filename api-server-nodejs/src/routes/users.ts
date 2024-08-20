import bcryptjs from "bcryptjs";
/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { appliedjobs } from "../models/appliedjobs"; // Adjust the import path based on your entity location
import { Profile } from "../models/profile";
import { checkToken } from "../config/safeRoutes";
import ActiveSession from "../models/activeSession";
import User from "../models/user";
import { connection } from "../server/database";
import { logoutUser } from "../controllers/logout.controller";
import { JobDetails as job_details } from "../models/job_details";

import { Location as location } from "../models/location";
import { Skill as skill } from "../models/skills";
import { Category as category } from "../models/category";
import { JobSkills } from "../models/jobskills";
// import { Location } from "../models/location";

// eslint-disable-next-line new-cap
const router = express.Router();
// Route: <HOST>:PORT/api/users/

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(4).max(15).optional(),
  password: Joi.string().required(),
  user_role: Joi.string(),
});

router.post("/register", (req, res) => {
  // Joy Validation
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { username, email, password, user_role } = req.body;

  console.log(req.body);

  const userRepository = connection!.getRepository(User);

  userRepository.findOne({ email }).then((user) => {
    if (user) {
      res.json({ success: false, msg: "Email already exists" });
    } else {
      bcryptjs.genSalt(10, (_err, salt) => {
        bcryptjs.hash(password, salt).then((hash) => {
          const query = {
            username,
            email,
            password: hash,
            user_role,
          };

          userRepository.save(query).then((u) => {
            res.json({
              success: true,
              userID: u.id,
              msg: "The user was successfully registered",
            });
          });
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  // Joy Validation
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { email } = req.body;
  const { password } = req.body;
  // const { user_role } = req.body;

  const userRepository = connection!.getRepository(User);
  const activeSessionRepository = connection!.getRepository(ActiveSession);
  userRepository.findOne({ email }).then((user) => {
    if (!user) {
      return res.json({ success: false, msg: "Wrong credentials" });
    }
    //nothing

    if (!user.password) {
      return res.json({ success: false, msg: "No password" });
    }

    // if (!user_role) {
    //   return res.json({ success: false, msg: "No role" });
    // }

    bcryptjs.compare(password, user.password, (_err2, isMatch) => {
      if (isMatch) {
        if (!process.env.SECRET) {
          throw new Error("SECRET not provided");
        }

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            email: user.email,
            // user_role: user.user_role,
          },
          process.env.SECRET,
          {
            expiresIn: 86400, // 1 week
          }
        );

        const query = { userId: user.id, token };

        activeSessionRepository.save(query);
        // Delete the password (hash)
        (user as { password: string | undefined }).password = undefined;
        return res.json({
          success: true,
          token,
          user,
        });
      }
      return res.json({ success: false, msg: "Wrong credentials" });
    });
  });
});

router.post("/logout", checkToken, logoutUser);

router.post("/checkSession", checkToken, (_req, res) => {
  res.json({ success: true });
});

router.post("/all", checkToken, (_req, res) => {
  const userRepository = connection!.getRepository(User);

  userRepository
    .find({})
    .then((users) => {
      users = users.map((item) => {
        const x = item;
        (x as { password: string | undefined }).password = undefined;
        return x;
      });
      res.json({ success: true, users });
    })
    .catch(() => res.json({ success: false }));
});

router.post("/edit", checkToken, (req, res) => {
  const { userID, username, email } = req.body;

  const userRepository = connection!.getRepository(User);

  userRepository.find({ id: userID }).then((user) => {
    if (user.length === 1) {
      const query = { id: user[0].id };
      const newvalues = { username, email };
      userRepository
        .update(query, newvalues)
        .then(() => {
          res.json({ success: true });
        })
        .catch(() => {
          res.json({
            success: false,
            msg: "There was an error. Please contract the administrator",
          });
        });
    } else {
      res.json({ success: false, msg: "Error updating user" });
    }
  });
});
router.get("/joblisting", async (req, res) => {
  try {
    const jobRepository = getRepository(job_details);
    const jobSkillsRepository = getRepository(JobSkills);
    const locationRepository = getRepository(location);
    const skillRepository = getRepository(skill);
    const categoryRepository = getRepository(category);

    const {
      skills,
      location: locationQuery,
      category: categoryQuery,
    } = req.query;

    // Create the base query for job details
    let query = jobRepository.createQueryBuilder("job");

    if (skills) {
      query = query.andWhere("job.skills ILIKE :skills", {
        skills: `%${skills}%`,
      });
    }

    if (locationQuery) {
      query = query.andWhere("job.location_id IN (:...locationIds)", {
        locationIds: (
          await locationRepository.find({
            where: { location_name: locationQuery },
          })
        ).map((loc) => loc.id),
      });
    }

    if (categoryQuery) {
      query = query.andWhere("job.category_id IN (:...categoryIds)", {
        categoryIds: (
          await categoryRepository.find({
            where: { categoryName: categoryQuery },
          })
        ).map((cat) => cat.id),
      });
    }

    const jobs = await query.getMany();

    // Prepare the response array
    const jobsWithDetails: any[] = [];

    for (const job of jobs) {
      // Fetch related location entity
      const location1 = await locationRepository.findOne({
        where: { id: job.location_id },
      });

      // Fetch related category entity
      const category1 = await categoryRepository.findOne({
        where: { id: job.category_id },
      });

      const jobSkillEntries = await jobSkillsRepository.find({
        where: { job_details_id: job.id },
      });

      const skillIds = jobSkillEntries.flatMap((entry) => {
        // Use optional chaining and provide a default value if entry.skills_id is undefined
        const skillsIdString = entry.skills_id ?? "";
        return skillsIdString
          .split(",")
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id));
      });

      // Fetch the skill entities using the array of IDs
      const skillsEntities = await skillRepository.findByIds(skillIds);

      // Extract skill names from the fetched skill entities
      const skillNames = skillsEntities.map((skills) => skills.skillName);

      // Build the job detail with names
      const jobWithDetails = {
        ...job,
        location_name: location1 ? location1.location_name : null,
        country: location1 ? location1.country : null, // Added country field
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
router.get("/joblisting/:id", async (req, res) => {
  try {
    const jobRepository = getRepository(job_details);
    const jobSkillsRepository = getRepository(JobSkills);
    const locationRepository = getRepository(location);
    const skillRepository = getRepository(skill);
    const categoryRepository = getRepository(category);

    // Fetch the job details by ID
    const job = await jobRepository.findOne(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    // Fetch related location entity
    const location1 = await locationRepository.findOne({
      where: { id: job.location_id },
    });

    // Fetch related category entity
    const category1 = await categoryRepository.findOne({
      where: { id: job.category_id },
    });

    // Fetch job skills
    const jobSkillEntries = await jobSkillsRepository.find({
      where: { job_details_id: job.id },
    });

    // Extract skill IDs and fetch skill names
    // const skillIds = jobSkillEntries.map((entry) => entry.skills_id);
    // const skillsEntities = await skillRepository.findByIds(skillIds);
    // const skillNames = skillsEntities.map((skills) => skills.skillName);

    const skillIds = jobSkillEntries.flatMap((entry) => {
      // Use optional chaining and provide a default value if entry.skills_id is undefined
      const skillsIdString = entry.skills_id ?? "";
      return skillsIdString
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    });

    // Fetch the skill entities using the array of IDs
    const skillsEntities = await skillRepository.findByIds(skillIds);

    // Extract skill names from the fetched skill entities
    const skillNames = skillsEntities.map((skills) => skills.skillName);

    console.log(skillNames, "fghjklkjhgfdsasdfghj");
    // Build the job detail with names
    const jobWithDetails = {
      ...job,
      location_name: location1 ? location1.location_name : null,
      country: location1 ? location1.country : null, // Include country field
      skill_names: skillNames, // Array of skill names
      category_name: category1 ? category1.categoryName : null,
    };

    res.status(200).json({ success: true, job: jobWithDetails });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching job details" });
  }
});

// router.get("/joblisting", async (req, res) => {
//   try {
//     const jobRepository = getRepository(job_details);

//     const { skills, location, category } = req.query;

//     let query = jobRepository.createQueryBuilder("job");

//     if (skills) {
//       query = query.andWhere("job.skills ILIKE :skills", {
//         skills: `%${skills}%`,
//       });
//     }

//     if (location) {
//       query = query.andWhere("job.location ILIKE :location", {
//         location: `%${location}%`,
//       });
//     }

//     if (category) {
//       query = query.andWhere("job.category ILIKE :category", {
//         category: `%${category}%`,
//       });
//     }

//     const jobs = await query.getMany();
//     res.status(200).json({ success: true, jobs });
//   } catch (err) {
//     console.error("Error fetching jobs:", err);
//     res.status(500).json({ success: false, msg: "Error fetching jobs" });
//   }
// });

// router.get("/joblisting/:id", async (_req, res) => {
//   try {
//     const jobRepository = getRepository(job_details);
//     const job = await jobRepository.findOne(_req.params.id);
//     if (job) {
//       res.status(200).json({ success: true, job });
//     } else {
//       res.status(404).json({ success: false, error: "Job not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching job details:", error);
//     res
//       .status(500)
//       .json({ success: false, error: "Error fetching job details" });
//   }
// });

router.get("/users/:userId/appliedjobs", async (req, res) => {
  const { userId } = req.params;

  try {
    const appliedJobsRepository = getRepository(appliedjobs);
    const appliedJobs = await appliedJobsRepository.find({
      where: { userid: userId },
    });

    if (!appliedJobs.length) {
      return res
        .status(404)
        .json({ error: "No applied jobs found for the user" });
    }

    const jobIds = appliedJobs.map((job) => job.jobid);

    const jobDetailsRepository = getRepository(job_details);
    const jobs = await jobDetailsRepository.findByIds(jobIds);

    const jobsWithDetails = appliedJobs.map((appliedJob) => {
      const jobDetail = jobs.find((job) => job.id === appliedJob.jobid);
      return { ...appliedJob, jobDetails: jobDetail };
    });

    res.json({ jobs: jobsWithDetails });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: "Error fetching applied jobs" });
  }
});

router.post("/profiles", async (req, res) => {
  const profileRepository = getRepository(Profile);

  const {
    userId,
    name,
    email,
    phone,
    gender,
    city,
    country,
    education,
    skills, 
    description,
  } = req.body;

  try {
  
    const skillsString = JSON.stringify(skills); // or skills.join(",") if storing as a comma-separated string

    const newProfile = profileRepository.create({
      userId,
      name,
      email,
      phone,
      gender,
      city,
      country,
      education,
      skills: skillsString, 
      description,
    });

    const savedProfile = await profileRepository.save(newProfile);

    res.status(201).json(savedProfile); // Respond with the created profile details
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Error saving profile" }); // Handle errors
  }
});

// Route to update an existing profile
router.put("/profiles/:userId", async (req, res) => {
  try {
    const profileRepository = getRepository(Profile);
    const { userId } = req.params;
    const profileData = { ...req.body, skills: req.body.skills.join(",") };

    // Check if the profile exists
    const existingProfile = await profileRepository.findOne({
      where: { userId },
    });
    if (!existingProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found. Use the create route." });
    }

    // Update existing profile
    profileRepository.merge(existingProfile, profileData);
    await profileRepository.save(existingProfile);
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch a profile by userId
router.get("/profiles/:userId", async (req, res) => {
  try {
    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({
      where: { userId: req.params.userId },
    });
    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: "Profile not found" });
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/testme", (_req, res) => {
  res.status(200).json({ success: true, msg: "all good" });
});

export default router;
