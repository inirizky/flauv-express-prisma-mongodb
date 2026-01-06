import express from "express";
import { generateAi } from "../controller/ai.controller.js";
import { upload } from "../services/uploadImage.service.js";

const router = express.Router();

router.post("/generate", upload.single("file"), generateAi);

export default router;
