import express from "express";
import {
  createUserPlant,
  deleteUserPlant,
  editUserPlantById,
  generateUserPlantByAI,
  readUserPlantById,
  readUserPlants,
} from "../controller/userPlant.controller.js";
import authenticateToken from "../middleware/auth.js";
import { upload } from "../services/uploadImage.service.js";

const router = express.Router();
router.post(
  "/generate",
  authenticateToken,
  upload.single("file"),
  generateUserPlantByAI
);
router.post("/new", authenticateToken, createUserPlant);
router.put("/:id", authenticateToken, editUserPlantById);
router.delete("/:id", authenticateToken, deleteUserPlant);
router.get("/:id", authenticateToken, readUserPlantById);
router.get("/", authenticateToken, readUserPlants);

export default router;
