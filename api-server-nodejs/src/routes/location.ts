import express from "express";
import { getRepository, Not } from "typeorm";
import { Location as location } from "../models/location"; // Ensure this path is correct

const locationRouter = express.Router();

// Get all locations
locationRouter.get("/locations", async (_req, res) => {
  try {
    const locationRepository = getRepository(location);
    const locations = await locationRepository.find();
    res.status(200).json({ success: true, locations });
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ success: false, msg: "Error fetching locations" });
  }
});

// Get a single location by ID
locationRouter.get("/locations/:id", async (req, res) => {
  try {
    const locationRepository = getRepository(location);
    const id = parseInt(req.params.id, 10);
    const locationEntity = await locationRepository.findOne(id);

    if (locationEntity) {
      res.status(200).json({ success: true, location: locationEntity });
    } else {
      res.status(404).json({ success: false, msg: "Location not found" });
    }
  } catch (err) {
    console.error("Error fetching location:", err);
    res.status(500).json({ success: false, msg: "Error fetching location" });
  }
});

// Create a new location
locationRouter.post("/locations", async (req, res) => {
  try {
    const locationRepository = getRepository(location);
    const { location_name, country } = req.body;

    // Check for existing location with the same name and country
    const existingLocation = await locationRepository.findOne({
      where: { location_name, country },
    });

    if (existingLocation) {
      return res
        .status(400)
        .json({ success: false, msg: "Location already exists" });
    }

    const newLocation = locationRepository.create({ location_name, country });
    await locationRepository.save(newLocation);

    res.status(201).json({ success: true, location: newLocation });
  } catch (err) {
    console.error("Error creating location:", err);
    res.status(500).json({ success: false, msg: "Error creating location" });
  }
});

// Update a location
locationRouter.put("/locations/:id", async (req, res) => {
  try {
    const locationRepository = getRepository(location);
    const id = parseInt(req.params.id, 10);
    const { location_name, country } = req.body;
    const locationEntity = await locationRepository.findOne(id);

    if (locationEntity) {
      // Check for existing location with the same name and country
      const existingLocation = await locationRepository.findOne({
        where: { location_name, country, id: Not(id) },
      });

      if (existingLocation) {
        return res.status(400).json({
          success: false,
          msg: "Location with this name and country already exists",
        });
      }

      locationEntity.location_name = location_name;
      locationEntity.country = country;
      await locationRepository.save(locationEntity);
      res.status(200).json({ success: true, location: locationEntity });
    } else {
      res.status(404).json({ success: false, msg: "Location not found" });
    }
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ success: false, msg: "Error updating location" });
  }
});

// Delete a location
locationRouter.delete("/locations/:id", async (req, res) => {
  try {
    const locationRepository = getRepository(location);
    const id = parseInt(req.params.id, 10);
    const result = await locationRepository.delete(id);

    if (result.affected) {
      res
        .status(200)
        .json({ success: true, msg: "Location deleted successfully" });
    } else {
      res.status(404).json({ success: false, msg: "Location not found" });
    }
  } catch (err) {
    console.error("Error deleting location:", err);
    res.status(500).json({ success: false, msg: "Error deleting location" });
  }
});

export default locationRouter;
