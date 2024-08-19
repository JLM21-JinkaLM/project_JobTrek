import express from "express";
import { getRepository } from "typeorm";
import { appliedjobs } from "../models/appliedjobs";
import { JobDetails as job_details } from "../models/job_details";
import { Profile } from "../models/profile";
import User from "../models/user";

const appliedRouter = express.Router();

appliedRouter.post("/apply", async (req, res) => {
  const { userid, jobid } = req.body;

  console.log(userid, jobid, "ooooooooooooooooooooooooooooooo");

  if (!userid || !jobid) {
    return res.status(400).json({ error: "UserId and JobId are required" });
  }

  try {
    const appliedJobRepository = getRepository(appliedjobs);

    // Check if the user has already applied for this job
    const existingApplication = await appliedJobRepository.findOne({
      where: {
        jobid,
        userid,
      },
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "User already applied for this job" });
    }

    // If not already applied, create a new applied job entry
    const appliedJob = new appliedjobs();
    appliedJob.jobid = jobid;
    appliedJob.userid = userid; // Ensure userid is correctly set
    appliedJob.dateofapplied = new Date();
    appliedJob.status = "Pending";

    await appliedJobRepository.save(appliedJob);

    res
      .status(200)
      .json({ success: true, message: "Successfully applied for the job" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ success: false, error: "Error applying for job" });
  }
});

appliedRouter.post("/check-application", async (req, res) => {
  const { userid, jobid } = req.body;

  if (!userid || !jobid) {
    return res.status(400).json({ error: "UserId and JobId are required" });
  }

  try {
    const appliedJobRepository = getRepository(appliedjobs);

    const existingApplication = await appliedJobRepository.findOne({
      where: {
        jobid,
        userid,
      },
    });

    if (existingApplication) {
      return res.status(200).json({ applied: true });
    } else {
      return res.status(200).json({ applied: false });
    }
  } catch (error) {
    console.error("Error checking job application:", error);
    res
      .status(500)
      .json({ success: false, error: "Error checking job application" });
  }
});

appliedRouter.get("/appliedcount/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const appliedJobRepository = getRepository(appliedjobs);

    // Count the number of applied jobs for the given user
    const count = await appliedJobRepository.count({
      where: {
        userid: userId,
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching applied job count:", error);
    res.status(500).json({ error: "Failed to fetch applied job count" });
  }
});

appliedRouter.get("/:userId/appliedjobs", async (req, res) => {
  const { userId } = req.params;

  try {
    const appliedJobRepository = getRepository(appliedjobs);

    // Fetch all applied jobs for the given user
    const appliedJobs = await appliedJobRepository.find({
      where: {
        userid: userId,
      },
    });

    // Fetch job details for each applied job
    const jobsWithDetails = await Promise.all(
      appliedJobs.map(async (appliedJob) => {
        const jobDetailsRepository = getRepository(job_details);
        const jobDetails = await jobDetailsRepository.findOne(appliedJob.jobid);
        return {
          ...appliedJob,
          jobDetails: jobDetails || {}, // Ensure jobDetails is not null
        };
      })
    );

    res.status(200).json({ jobs: jobsWithDetails });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ error: "Failed to fetch applied jobs" });
  }
});

appliedRouter.get("/totalappliedusers", async (_req, res) => {
  try {
    const appliedJobRepository = getRepository(appliedjobs);

    // Query to get distinct user IDs and count them
    const result = await appliedJobRepository
      .createQueryBuilder("appliedjobs")
      .select("COUNT(DISTINCT appliedjobs.userid)", "count")
      .getRawOne();

    const totalUsersApplied = result ? result.count : 0;

    res.status(200).json({ totalUsersApplied });
  } catch (error) {
    console.error("Error fetching total applied users:", error);
    res.status(500).json({ error: "Failed to fetch total applied users" });
  }
});

appliedRouter.get("/unique-applied-users", async (_req, res) => {
  try {
    const appliedJobRepository = getRepository(appliedjobs);
    const userRepository = getRepository(User);

    // Find unique user IDs from the appliedjobs table
    const uniqueUserIds = await appliedJobRepository
      .createQueryBuilder("appliedJob")
      .select("DISTINCT appliedJob.userid", "userid") // Ensure this is the correct column name
      .getRawMany();

    const userIds = uniqueUserIds.map((user) => user.userid); // Use 'userid' here

    // Fetch user details and count the number of jobs applied by each user
    const users = await userRepository
      .createQueryBuilder("user")
      .select([
        "user.id AS user_id",
        "user.username AS user_name",
        "user.email AS user_email",
        "COUNT(appliedJob.id) AS appliedJobCount",
      ])
      .leftJoin(appliedjobs, "appliedJob", "appliedJob.userid = user.id")
      .where("user.id IN (:...userIds)", { userIds })
      .groupBy("user.id")
      .getRawMany();

    res.json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

appliedRouter.get("/unique-applied-users-job/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const appliedJobRepository = getRepository(appliedjobs);
    const userRepository = getRepository(User);

    // Check if there are any entries for the given jobId in the appliedjobs table
    const jobEntries = await appliedJobRepository
      .createQueryBuilder("appliedJob")
      .where("appliedJob.jobid = :jobId", { jobId })
      .getCount();

    if (jobEntries === 0) {
      return res
        .status(404)
        .json({ message: "No users have applied for this job." });
    }

    // Find unique user IDs from the appliedjobs table for the specific job
    const uniqueUserIds = await appliedJobRepository
      .createQueryBuilder("appliedJob")
      .select("DISTINCT appliedJob.userid", "userid")
      .where("appliedJob.jobid = :jobId", { jobId })
      .getRawMany();

    const userIds = uniqueUserIds.map((user) => user.userid);

    // Fetch user details for the specified job ID
    const users = await userRepository
      .createQueryBuilder("user")
      .select([
        "user.id AS user_id",
        "user.username AS user_name",
        "user.email AS user_email",
      ])
      .where("user.id IN (:...userIds)", { userIds })
      .getRawMany();

    res.json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data" });
  }
});

appliedRouter.get("/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profileRepository = getRepository(Profile);
    const profile = await profileRepository.findOne({ where: { userId } });

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

appliedRouter.post("/accept/:jobid/:userid", async (req, res) => {
  try {
    const { jobid, userid } = req.params;
    const appliedJobRepository = getRepository(appliedjobs);

    // Find the applied job entry
    const appliedJob = await appliedJobRepository.findOne({
      where: { jobid, userid },
    });

    if (!appliedJob) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    // Update AppliedJob status to accepted
    appliedJob.status = "Accepted";
    await appliedJobRepository.save(appliedJob);

    res.status(200).json({ message: "User accepted successfully" });
  } catch (err) {
    console.error("Error accepting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to reject a user based on jobId and userId
appliedRouter.post("/reject/:jobid/:userid", async (req, res) => {
  try {
    const { jobid, userid } = req.params;
    const appliedJobRepository = getRepository(appliedjobs);

    // Find the applied job entry
    const appliedJob = await appliedJobRepository.findOne({
      where: { jobid, userid },
    });

    if (!appliedJob) {
      return res.status(404).json({ message: "Applied job not found" });
    }

    // Update AppliedJob status to rejected
    appliedJob.status = "Rejected";
    await appliedJobRepository.save(appliedJob);

    res.status(200).json({ message: "User rejected successfully" });
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

appliedRouter.get("/status/:jobId/:userId", async (req, res) => {
  const { jobId, userId } = req.params;

  try {
    const appliedJobRepository = getRepository(appliedjobs);
    const appliedJob = await appliedJobRepository.findOne({
      where: {
        jobid: jobId,
        userid: userId,
      },
    });

    if (!appliedJob) {
      return res.status(404).json({ status: "not_found" });
    }

    // Return the application status
    res.json({ status: appliedJob.status });
  } catch (err) {
    console.error("Error fetching application status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
appliedRouter.get("/userjobs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log(userId, "userid.............................................");

    const appliedJobRepository = getRepository(appliedjobs);
    const jobDetailsRepository = getRepository(job_details);

    // Fetch all job applications for the user
    const appliedJobs = await appliedJobRepository.find({
      where: { userid: userId },
    });

    if (appliedJobs.length === 0) {
      return res.json({ jobs: [] });
    }

    // Extract job IDs from the applied jobs
    const jobIds = appliedJobs.map((job) => job.jobid);

    // Fetch job details for the job IDs
    const jobDetails = await jobDetailsRepository.findByIds(jobIds);

    // Combine job details with application status
    const jobsWithStatus = appliedJobs
      .map((appliedJob) => {
        const jobDetail = jobDetails.find(
          (job) => job.id === String(appliedJob.jobid)
        );
        if (!jobDetail) {
          console.error(`Job details not found for job ID ${appliedJob.jobid}`);
          return null;
        }
        return {
          ...jobDetail,
          status: appliedJob.status,
        };
      })
      .filter((job) => job !== null); // Filter out any null values

    res.json({ jobs: jobsWithStatus });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching job details" });
  }
});

export default appliedRouter;
