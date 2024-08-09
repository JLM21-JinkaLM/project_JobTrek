import express from "express";
import { getRepository } from "typeorm";
import { Category } from "../models/category";

const categoryRouter = express.Router();

// Get all categories
categoryRouter.get("/categories", async (_req, res) => {
  try {
    const categoryRepository = getRepository(Category);
    const categories = await categoryRepository.find();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ success: false, msg: "Error fetching categories" });
  }
});

// Get a single category by ID
categoryRouter.get("/categories/:id", async (req, res) => {
  try {
    const categoryRepository = getRepository(Category);
    const id = parseInt(req.params.id, 10);
    const category = await categoryRepository.findOne(id);

    if (category) {
      res.status(200).json({ success: true, category });
    } else {
      res.status(404).json({ success: false, msg: "Category not found" });
    }
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ success: false, msg: "Error fetching category" });
  }
});

// Create a new category
categoryRouter.post("/categories", async (req, res) => {
  try {
    const { categoryName } = req.body;
    const categoryRepository = getRepository(Category);

    // Check for duplicate category
    const existingCategory = await categoryRepository.findOne({
      where: { categoryName },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        msg: "Category name already exists", // Specific error message for duplicate
      });
    }

    // Create new category
    const newCategory = categoryRepository.create({ categoryName });
    await categoryRepository.save(newCategory);
    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ success: false, msg: "Error creating category" });
  }
});

// Update a category
categoryRouter.put("/categories/:id", async (req, res) => {
  try {
    const categoryRepository = getRepository(Category);
    const id = parseInt(req.params.id, 10);
    const { categoryName } = req.body;
    const category = await categoryRepository.findOne(id);

    if (category) {
      // Check if new categoryName already exists
      const existingCategory = await categoryRepository.findOne({
        where: { categoryName },
      });

      if (existingCategory && existingCategory.id !== id) {
        return res.status(400).json({
          success: false,
          msg: "Category name already exists", // Specific error message for duplicate
        });
      }

      category.categoryName = categoryName;
      await categoryRepository.save(category);
      res.status(200).json({ success: true, category });
    } else {
      res.status(404).json({ success: false, msg: "Category not found" });
    }
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ success: false, msg: "Error updating category" });
  }
});

// Delete a category
categoryRouter.delete("/categories/:id", async (req, res) => {
  try {
    const categoryRepository = getRepository(Category);
    const id = parseInt(req.params.id, 10);
    const category = await categoryRepository.findOne(id);

    if (category) {
      await categoryRepository.remove(category);
      res
        .status(200)
        .json({ success: true, msg: "Category deleted successfully" });
    } else {
      res.status(404).json({ success: false, msg: "Category not found" });
    }
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ success: false, msg: "Error deleting category" });
  }
});

export default categoryRouter;
