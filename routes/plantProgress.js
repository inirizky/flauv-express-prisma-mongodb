import express from "express";
import authenticateToken from "../middleware/auth.js";
import { upload } from "../services/uploadImage.service.js";
import {
  createPlantProgress,
  readPlantProgress,
  readPlantProgressById,
} from "../controller/plantProgress.controller.js";

const router = express.Router();
router.post(
  "/generate",
  authenticateToken,
  upload.single("file"),
  createPlantProgress
);
router.post("/:id/new", authenticateToken, createPlantProgress);
// router.put("/:id", authenticateToken, editUserPlantById);
// router.delete("/:id", authenticateToken, deleteUserPlant);
// router.get("/:id", authenticateToken, readUserPlantById);
router.get("/:id", authenticateToken, readPlantProgressById);
router.get("/", authenticateToken, readPlantProgress);
export default router;
