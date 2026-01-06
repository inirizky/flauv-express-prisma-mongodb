import express from "express";
import { Me, userLogin, userRegister } from "../controller/user.controller.js";
import authenticateToken from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/me", authenticateToken, Me);

export default router;
