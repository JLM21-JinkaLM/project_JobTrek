// routes/skillRouter.ts
import express from "express";
import { getRepository } from "typeorm";
import { Skill } from "../models/skills";
import { Category } from "../models/category";

const skillRouter = express.Router();

// Get all skills
skillRouter.get("/skills", async (_req, res) => {
  try {
    const skillRepository = getRepository(Skill);
    const skills = await skillRepository.find({ relations: ["category"] });
    res.status(200).json({ success: true, skills });
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ success: false, msg: "Error fetching skills" });
  }
});

// Create a new skill
skillRouter.post("/skills", async (req, res) => {
  try {
    const { skillName, categoryId } = req.body;
    const skillRepository = getRepository(Skill);
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    const existingSkill = await skillRepository.findOne({
      where: { skillName },
    });
    if (existingSkill) {
      return res
        .status(400)
        .json({ success: false, msg: "Skill name already exists" });
    }

    const skill = skillRepository.create({ skillName, category });
    await skillRepository.save(skill);

    res.status(201).json({ success: true, skill });
  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ success: false, msg: "Error creating skill" });
  }
});

// Update a skill
skillRouter.put("/skills/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { skillName, categoryId } = req.body;
    const skillRepository = getRepository(Skill);
    const categoryRepository = getRepository(Category);

    const skill = await skillRepository.findOne(id);
    if (!skill) {
      return res.status(404).json({ success: false, msg: "Skill not found" });
    }

    const category = await categoryRepository.findOne(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Category not found" });
    }

    const existingSkill = await skillRepository.findOne({
      where: { skillName },
    });
    if (existingSkill && existingSkill.id !== id) {
      return res
        .status(400)
        .json({ success: false, msg: "Skill name already exists" });
    }

    skill.skillName = skillName;
    skill.category = category;
    await skillRepository.save(skill);

    res.status(200).json({ success: true, skill });
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ success: false, msg: "Error updating skill" });
  }
});

// Delete a skill
skillRouter.delete("/skills/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const skillRepository = getRepository(Skill);

    const skill = await skillRepository.findOne(id);
    if (!skill) {
      return res.status(404).json({ success: false, msg: "Skill not found" });
    }

    await skillRepository.remove(skill);

    res.status(200).json({ success: true, msg: "Skill deleted successfully" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).json({ success: false, msg: "Error deleting skill" });
  }
});

export default skillRouter;
