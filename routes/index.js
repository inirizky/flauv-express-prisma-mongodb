// src/route/index.js
import express from "express";
import UserRoute from "./user.js";
import GenerateAi from "./ai.js";
import Plant from "./plant.js";
import PlantProgress from "./plantProgress.js";

const router = express.Router();

// URL base untuk setiap route
router.use("/ai", GenerateAi);
router.use("/plant", Plant);
router.use("/plant-progress", PlantProgress);
router.use("/users", UserRoute);
// router.use("/transactions", TransactionRoute);
// router.use("/genres", GenreRoute);
// router.use("/movies", MovieRoute);

export default router;
